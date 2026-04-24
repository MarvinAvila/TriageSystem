// src/store/authStore.ts
import { create } from 'zustand';
import { type UsuarioAuth } from '../types';

interface AuthState {
    user: UsuarioAuth | null;
    login: (userData: UsuarioAuth) => void;
    logout: () => void;
}

// Zustand crea un "hook" global que podemos llamar desde cualquier componente
export const useAuthStore = create<AuthState>((set) => ({
    user: null, // Al inicio, nadie tiene sesión iniciada
    login: (userData) => set({ user: userData }),
    logout: () => set({ user: null }),
}));