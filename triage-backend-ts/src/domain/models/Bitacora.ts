// src/domain/models/Bitacora.ts
export interface Bitacora {
    id?: number;
    usuarioId?: number | null;
    turnoId?: number | null;
    evento: string;
    detalle: Record<string, any>;
    ts?: Date;
}