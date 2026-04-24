import { SignosVitales } from "../../domain/models/Enums";

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
