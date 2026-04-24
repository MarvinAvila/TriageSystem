// src/infrastructure/web/AuthController.ts

import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { LoginDTO } from '../../application/dtos/LoginDTO';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Usamos arrow functions (= async (req, res) =>) para no perder el contexto de 'this' en Express
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            // Casteamos el cuerpo de la petición a nuestro DTO
            const dto: LoginDTO = req.body;

            if (!dto.login || !dto.passwordPlan) {
                res.status(400).json({ error: 'Credenciales incompletas en la petición.' });
                return;
            }

            const result = await this.authService.login(dto.login, dto.passwordPlan);
            
            // HTTP 200: OK
            res.status(200).json(result);
            
        } catch (error: any) {
            // HTTP 401: Unauthorized (No autorizado)
            res.status(401).json({ error: error.message });
        }
    };
}