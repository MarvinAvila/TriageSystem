import { writePool, readPool } from '../database/pgConfig';
import { Paciente } from '../../domain/models/Paciente';

export class PacienteRepository {
    
    // ESCRITURA: Va al primario.
    async create(paciente: Paciente): Promise<Paciente> {
        const query = `
            INSERT INTO paciente (nombre, curp, edad)
            VALUES ($1, $2, $3)
            RETURNING id, nombre, curp, edad, ts_creado as "tsCreado";
        `;
        const values = [paciente.nombre, paciente.curp, paciente.edad];
        
        try {
            const result = await writePool.query(query, values);
            return result.rows[0] as Paciente;
        } catch (error) {
            console.error('Error en PacienteRepository.create:', error);
            throw error; // El controlador web atrapará esto para devolver un HTTP 500 o 400
        }
    }

    // LECTURA: Va a la réplica. Para verificar si un paciente ya existe.
    async findByCurp(curp: string): Promise<Paciente | null> {
        const query = 'SELECT id, nombre, curp, edad, ts_creado as "tsCreado" FROM paciente WHERE curp = $1';
        try {
            const result = await readPool.query(query, [curp]);
            if (result.rows.length === 0) return null;
            return result.rows[0] as Paciente;
        } catch (error) {
            console.error('Error en PacienteRepository.findByCurp:', error);
            throw error;
        }
    }
}