// src/domain/models/Turno.ts
import { TurnoEstado, PrioridadTriage } from './Enums';

export interface Turno {
    id?: number;
    pacienteId: number;
    recepcionistaId: number;
    medicoId?: number | null;
    prioridad: PrioridadTriage;
    estado: TurnoEstado;
    tsCreado?: Date;
    tsInicio?: Date | null;
    tsFin?: Date | null;
}
