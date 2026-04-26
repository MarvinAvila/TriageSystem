// src/server.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { readPool } from './infrastructure/database/pgConfig';
import { AuthController } from './infrastructure/web/AuthController';
import { TurnoController } from './infrastructure/web/TurnoController';

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middlewares globales
app.use(cors()); // Permite peticiones desde el frontend (React, Angular, etc.)
app.use(express.json()); // Transforma los bodies en texto a JSON automáticamente

// Instanciar Controladores
const authController = new AuthController();
const turnoController = new TurnoController();

// ==========================================
// DEFINICIÓN DE RUTAS (ENDPOINTS API REST)
// ==========================================

// Autenticación
app.post('/api/auth/login', authController.login);

// Turnos y Triage
app.post('/api/turnos', turnoController.registrarTurno);
app.post('/api/turnos/llamar/:medicoId', turnoController.llamarSiguiente);

// Healthcheck (Monitoreo de estado del servidor y conexión distribuida)
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        // Hacemos un ping ligero al nodo réplica para confirmar conexión
        const result = await readPool.query('SELECT NOW() as db_time');
        res.status(200).json({
            status: 'OPERATIVO',
            message: 'API REST Triage corriendo con arquitectura Clean',
            db_time: result.rows[0].db_time
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'DEGRADADO', 
            message: 'El servidor está activo pero no hay conexión a los nodos de Base de Datos' 
        });
    }
});

app.get('/api/turnos/publicos', turnoController.obtenerTurnosPublicos);

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend distribuido escuchando en http://localhost:${PORT}`);
    console.log(`🩺 Healthcheck disponible en http://localhost:${PORT}/api/health`);
});