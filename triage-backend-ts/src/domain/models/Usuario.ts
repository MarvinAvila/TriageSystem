// src/domain/models/Usuario.ts
import { UsuarioRol } from './Enums';

export interface Usuario {
    id?: number;
    login: string;
    hash?: string; // Solo se maneja en el backend para auth
    rol: UsuarioRol;
    activo: boolean;
}

