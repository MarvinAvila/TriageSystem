// src/domain/models/Paciente.ts
export interface Paciente {
    id?: number;
    nombre: string;
    curp: string;
    edad: number;
    tsCreado?: Date;
}