// src/application/services/PrioridadEngine.ts

import { SignosVitales, PrioridadTriage } from '../../domain/models/Enums';

export class PrioridadEngine {
    
    /**
     * Calcula la prioridad del triage basándose en parámetros fisiológicos.
     * Nivel 1: Resucitación (Riesgo vital inminente)
     * Nivel 5: No urgente
     */
    public calcularPrioridad(motivoConsulta: string, signos: SignosVitales): PrioridadTriage {
        let prioridad: PrioridadTriage = 5; // Por defecto, menos urgente

        const { frecuenciaCardiaca, temperatura, oxigeno } = this.normalizarSignos(signos);

        // REGLAS DE NEGOCIO (Simuladas - Puedes ajustarlas según tu lógica original)
        
        // Nivel 1: Peligro de muerte inminente
        if (oxigeno < 90 || frecuenciaCardiaca > 130 || frecuenciaCardiaca < 40) {
            return 1;
        }

        // Nivel 2: Emergencia (Muy urgente)
        if (oxigeno >= 90 && oxigeno <= 94 || temperatura > 40.0) {
            return 2;
        }

        // Nivel 3: Urgencia
        if (temperatura > 38.5 || frecuenciaCardiaca > 110) {
            return 3;
        }

        // Nivel 4: Menos Urgente (Ej. Fiebre leve, dolor moderado)
        if (temperatura > 37.5 || motivoConsulta.toLowerCase().includes('dolor')) {
            return 4;
        }

        return prioridad;
    }

    // Helper para garantizar que los valores numéricos sean seguros
    private normalizarSignos(signos: SignosVitales) {
        return {
            frecuenciaCardiaca: Number(signos.frecuenciaCardiaca) || 80,
            temperatura: Number(signos.temperatura) || 36.5,
            oxigeno: Number(signos.saturacionOxigeno) || 98
        };
    }
}