// src/services/api.ts
import axios from 'axios';

// Vite usa import.meta.env para leer el archivo .env que creamos antes
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor opcional: ideal por si en el futuro agregas Tokens JWT
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);