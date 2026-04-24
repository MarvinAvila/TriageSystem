import { writePool, readPool } from '../database/pgConfig';
import { Usuario } from '../../domain/models/Usuario';

export class UsuarioRepository {
    
    // LECTURA: Va a la réplica. Ideal para el login.
    async findByLogin(login: string): Promise<Usuario | null> {
        const query = 'SELECT id, login, hash, rol, activo FROM usuario WHERE login = $1 AND activo = true';
        try {
            const result = await readPool.query(query, [login]);
            if (result.rows.length === 0) return null;
            return result.rows[0] as Usuario;
        } catch (error) {
            console.error('Error en UsuarioRepository.findByLogin:', error);
            throw error;
        }
    }

    // ESCRITURA: Va al primario. (Por si implementas creación de usuarios)
    async create(usuario: Usuario): Promise<Usuario> {
        const query = `
            INSERT INTO usuario (login, hash, rol, activo)
            VALUES ($1, $2, $3, $4)
            RETURNING id, login, rol, activo;
        `;
        const values = [usuario.login, usuario.hash, usuario.rol, usuario.activo ?? true];
        try {
            const result = await writePool.query(query, values);
            return result.rows[0] as Usuario;
        } catch (error) {
            console.error('Error en UsuarioRepository.create:', error);
            throw error;
        }
    }
}