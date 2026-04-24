// src/application/services/AuthService.ts

import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';

export class AuthService {
    private usuarioRepo: UsuarioRepository;

    constructor() {
        this.usuarioRepo = new UsuarioRepository();
    }

    /**
     * CASO DE USO: Iniciar sesión de Recepcionistas o Médicos.
     */
    async login(login: string, passwordPlan: string) {
        const usuario = await this.usuarioRepo.findByLogin(login);

        if (!usuario) {
            throw new Error('Credenciales inválidas o usuario inactivo.');
        }

        // NOTA DE SEGURIDAD: Aquí deberíamos usar bcrypt para comparar el hash.
        // Simulando la comparación para el ejemplo:
        if (usuario.hash !== passwordPlan) {
            throw new Error('Credenciales inválidas.');
        }

        // Retornamos el usuario sin el hash por seguridad
        const { hash, ...usuarioSeguro } = usuario;
        
        return {
            mensaje: 'Autenticación exitosa',
            usuario: usuarioSeguro
        };
    }
}