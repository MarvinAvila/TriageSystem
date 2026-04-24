export interface TurnoPublicoDTO {
    turnoId: number;
    pacienteNombre: string;
    prioridad: number;
    estado: string; // 'EN_COLA' o 'Llamado a Consultorio X'
}