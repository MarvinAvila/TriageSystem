// src/infrastructure/web/TurnoController.ts

import { Request, Response } from "express";
import { TriageService } from "../../application/services/TriageService";
import { TurnoRegistroDTO } from "../../application/dtos/TurnoRegistroDTO";

export class TurnoController {
  private triageService: TriageService;

  constructor() {
    this.triageService = new TriageService();
  }

  public registrarTurno = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const dto: TurnoRegistroDTO = req.body;

      const result = await this.triageService.registrarPacienteYTurno(
        dto.paciente,
        dto.recepcionistaId,
        dto.motivoConsulta,
        dto.signosVitales,
      );

      // HTTP 201: Created (Recurso creado exitosamente)
      res.status(201).json(result);
    } catch (error: any) {
      // HTTP 500: Internal Server Error
      console.error("Error en controlador registrarTurno:", error);
      res
        .status(500)
        .json({
          error: "Fallo interno al registrar el turno",
          detalle: error.message,
        });
    }
  };

  public llamarSiguiente = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      // SOLUCIÓN: Usamos 'as string' para garantizar el tipo y '10' para base decimal
      const parametroId = req.params.medicoId as string;
      const medicoId = parseInt(parametroId, 10);

      if (isNaN(medicoId)) {
        res
          .status(400)
          .json({ error: "El ID del médico debe ser un número válido." });
        return;
      }

      const result = await this.triageService.llamarSiguientePaciente(medicoId);

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en controlador llamarSiguiente:", error);
      res
        .status(500)
        .json({
          error: "Fallo interno al llamar paciente",
          detalle: error.message,
        });
    }
  };

  public obtenerTurnosPublicos = async (req: Request, res: Response): Promise<void> => {
    try {
        const turnos = await this.triageService.obtenerTurnosPublicos();
        res.status(200).json(turnos);
    } catch (error: any) {
        res.status(500).json({ error: 'Fallo al obtener turnos públicos' });
    }
};
}
