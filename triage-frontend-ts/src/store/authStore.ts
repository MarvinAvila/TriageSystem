// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type UsuarioAuth } from '../types';

interface AuthState {
    user: UsuarioAuth | null;
    login: (userData: UsuarioAuth) => void;
    logout: () => void;
}

// Zustand crea un "hook" global que podemos llamar desde cualquier componente
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (userData) => set({ user: userData }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'triage-auth-session', // Nombre de la llave en el localStorage
        }
    )
);