// src/types/index.ts

export type RolUsuario = 'admin' | 'recepcion' | 'medico' | 'pantalla';

export interface SignosVitales {
    temperatura: number;
    frecuenciaCardiaca: number;
    saturacionOxigeno: number;
}

export interface TurnoRegistroDTO {
    paciente: {
        nombre: string;
        curp: string;
        edad: number;
    };
    motivoConsulta: string;
    signosVitales: SignosVitales;
    recepcionistaId: number;
}

export interface UsuarioAuth {
    id: number;
    login: string;
    rol: RolUsuario;
}

export interface TurnoPublicoDTO {
    turnoId: number;
    pacienteNombre: string;
    prioridad: number;
    estado: string;
}