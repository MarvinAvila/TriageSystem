import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Pool exclusivo para operaciones INSERT, UPDATE, DELETE
export const writePool = new Pool({
    host: process.env.DB_WRITE_HOST,
    port: Number(process.env.DB_WRITE_PORT),
    database: process.env.DB_WRITE_NAME,
    user: process.env.DB_WRITE_USER,
    password: process.env.DB_WRITE_PASSWORD,
    max: 20,
    idleTimeoutMillis: 600000,
    connectionTimeoutMillis: 30000,
});

// Pool exclusivo para operaciones SELECT
export const readPool = new Pool({
    host: process.env.DB_READ_HOST,
    port: Number(process.env.DB_READ_PORT),
    database: process.env.DB_READ_NAME,
    user: process.env.DB_READ_USER,
    password: process.env.DB_READ_PASSWORD,
    max: 40, 
    idleTimeoutMillis: 600000,
    connectionTimeoutMillis: 30000,
});

// Monitoreo de conexiones
writePool.on('connect', () => console.log('🟢 Conectado al Nodo PRIMARIO (Escritura)'));
readPool.on('connect', () => console.log('🔵 Conectado al Nodo RÉPLICA (Lectura)'));

writePool.on('error', (err) => console.error('🚨 Error en el Nodo Primario', err));
readPool.on('error', (err) => console.error('🚨 Error en el Nodo Réplica', err));