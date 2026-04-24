import { writePool, readPool } from '../database/pgConfig';
import { Turno } from '../../domain/models/Turno';
import { TurnoEstado } from '../../domain/models/Enums';

export class TurnoRepository {
    
    // ESCRITURA: Va al primario. Crea el turno y dispara tu Trigger DDL automáticamente.
    async create(turno: Turno): Promise<Turno> {
        const query = `
            INSERT INTO turno (paciente_id, recepcionista_id, prioridad, estado)
            VALUES ($1, $2, $3, $4)
            RETURNING id, paciente_id as "pacienteId", recepcionista_id as "recepcionistaId", prioridad, estado, ts_creado as "tsCreado";
        `;
        const values = [turno.pacienteId, turno.recepcionistaId, turno.prioridad, turno.estado];
        
        try {
            const result = await writePool.query(query, values);
            return result.rows[0] as Turno;
        } catch (error) {
            console.error('Error en TurnoRepository.create:', error);
            throw error;
        }
    }

    // LECTURA PESADA: Va a la réplica. Usa el índice idx_turno_cola que creaste en SQL.
    async obtenerColaDeEspera(): Promise<any[]> {
        const query = `
            SELECT t.id, p.nombre as paciente_nombre, t.prioridad, t.ts_creado
            FROM turno t
            JOIN paciente p ON t.paciente_id = p.id
            WHERE t.estado = $1
            ORDER BY t.prioridad DESC, t.ts_creado ASC;
        `;
        try {
            const result = await readPool.query(query, [TurnoEstado.EN_COLA]);
            return result.rows;
        } catch (error) {
            console.error('Error en TurnoRepository.obtenerColaDeEspera:', error);
            throw error;
        }
    }

    // ESCRITURA: Va al primario. Cuando el médico llama a un paciente.
    async asignarMedicoYCambiarEstado(turnoId: number, medicoId: number, estado: TurnoEstado): Promise<void> {
        const query = `
            UPDATE turno 
            SET medico_id = $1, estado = $2, ts_inicio = CURRENT_TIMESTAMP
            WHERE id = $3;
        `;
        try {
            await writePool.query(query, [medicoId, estado, turnoId]);
        } catch (error) {
            console.error('Error al actualizar estado del turno:', error);
            throw error;
        }
    }
}