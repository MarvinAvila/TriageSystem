import { writePool } from '../database/pgConfig';
import { Sintomas } from '../../domain/models/Sintomas';

export class SintomasRepository {
    
    // ESCRITURA: Va al nodo Primario. 
    // Nota: PostgreSQL a través de 'pg' convierte automáticamente los objetos JS a JSONB.
    async create(sintomas: Sintomas): Promise<Sintomas> {
        const query = `
            INSERT INTO sintomas (turno_id, motivo_consulta, signos_vitales, prioridad_calculada)
            VALUES ($1, $2, $3, $4)
            RETURNING id, turno_id as "turnoId", motivo_consulta as "motivoConsulta", signos_vitales as "signosVitales", prioridad_calculada as "prioridadCalculada";
        `;
        const values = [
            sintomas.turnoId,
            sintomas.motivoConsulta,
            sintomas.signosVitales, 
            sintomas.prioridadCalculada
        ];
        
        try {
            const result = await writePool.query(query, values);
            return result.rows[0] as Sintomas;
        } catch (error) {
            console.error('Error en SintomasRepository.create:', error);
            throw error;
        }
    }
}