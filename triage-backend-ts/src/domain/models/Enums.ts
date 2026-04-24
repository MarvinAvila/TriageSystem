// src/domain/models/Enums.ts

export enum UsuarioRol {
    RECEPCION = 'recepcion',
    MEDICO = 'medico',
    PANTALLA = 'pantalla',
    ADMIN = 'admin'
}

export enum TurnoEstado {
    EN_COLA = 'EN_COLA',
    ATENDIENDO = 'ATENDIENDO',
    FINALIZADO = 'FINALIZADO',
    CANCELADO = 'CANCELADO'
}

export type PrioridadTriage = 1 | 2 | 3 | 4 | 5;

export interface SignosVitales {
    presionArterial: string;
    frecuenciaCardiaca: number;
    temperatura: number;
    saturacionOxigeno: number;
    frecuenciaRespiratoria?: number;
}