import { PrioridadTriage, SignosVitales } from './Enums';

export interface Sintomas {
    id?: number;
    turnoId: number;
    motivoConsulta: string;
    signosVitales: SignosVitales;
    prioridadCalculada: PrioridadTriage;
    tsRegistro?: Date;
}