// src/application/services/TriageService.ts

import { TurnoRepository } from '../../infrastructure/repositories/TurnoRepository';
import { PacienteRepository } from '../../infrastructure/repositories/PacienteRepository';
import { PrioridadEngine } from './PrioridadEngine';
import { Paciente } from '../../domain/models/Paciente';
import { TurnoEstado, SignosVitales } from '../../domain/models/Enums';

export class TriageService {
    private turnoRepo: TurnoRepository;
    private pacienteRepo: PacienteRepository;
    private prioridadEngine: PrioridadEngine;

    constructor() {
        this.turnoRepo = new TurnoRepository();
        this.pacienteRepo = new PacienteRepository();
        this.prioridadEngine = new PrioridadEngine();
    }

    /**
     * CASO DE USO: Registrar un nuevo paciente en la clínica y asignarle un turno.
     */
    async registrarPacienteYTurno(
        datosPaciente: Paciente, 
        recepcionistaId: number, 
        motivoConsulta: string, 
        signosVitales: SignosVitales
    ) {
        // 1. Verificar si el paciente ya existe (buscamos en el nodo Réplica)
        let paciente = await this.pacienteRepo.findByCurp(datosPaciente.curp);
        
        // Si no existe, lo creamos (escribimos en el nodo Primario)
        if (!paciente) {
            paciente = await this.pacienteRepo.create(datosPaciente);
        }

        // 2. Calcular la prioridad médica usando el motor de reglas
        const prioridadCalculada = this.prioridadEngine.calcularPrioridad(motivoConsulta, signosVitales);

        // 3. Crear el Turno en estado EN_COLA (escribimos en el nodo Primario)
        // El trigger SQL que creaste en la BD se encargará de guardar esto en la tabla bitácora.
        const nuevoTurno = await this.turnoRepo.create({
            pacienteId: paciente.id!,
            recepcionistaId: recepcionistaId,
            prioridad: prioridadCalculada,
            estado: TurnoEstado.EN_COLA
        });

        /* Nota: Faltaría el repositorio de Síntomas para guardar los signos vitales 
           relacionados a este turno, pero con esto tienes la lógica principal orquestada.
        */

        return {
            mensaje: 'Turno generado con éxito',
            turno: nuevoTurno,
            paciente: paciente
        };
    }

    /**
     * CASO DE USO: El médico presiona el botón "Llamar Siguiente"
     */
    async llamarSiguientePaciente(medicoId: number) {
        // Obtenemos la cola desde el nodo Réplica (optimizado)
        const cola = await this.turnoRepo.obtenerColaDeEspera();

        if (cola.length === 0) {
            return { mensaje: 'No hay pacientes en la cola actualmente.', turno: null };
        }

        // Tomamos el primero (ya viene ordenado por prioridad y fecha desde SQL)
        const siguienteTurno = cola[0];

        // Actualizamos en el nodo Primario
        await this.turnoRepo.asignarMedicoYCambiarEstado(siguienteTurno.id, medicoId, TurnoEstado.ATENDIENDO);

        return {
            mensaje: 'Paciente asignado',
            turnoId: siguienteTurno.id,
            paciente: siguienteTurno.paciente_nombre
        };
    }
}