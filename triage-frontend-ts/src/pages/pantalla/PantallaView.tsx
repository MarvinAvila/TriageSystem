import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { type TurnoPublicoDTO } from "../../types";

export const PantallaView = () => {
  const [turnos, setTurnos] = useState<TurnoPublicoDTO[]>([]);

  useEffect(() => {
    let isMounted = true; // Bandera para saber si la pantalla sigue abierta

    const fetchTurnos = async () => {
      try {
        const response = await api.get<TurnoPublicoDTO[]>("/turnos/publicos");
        // Solo actualizamos el estado si el componente sigue montado en pantalla
        if (isMounted) {
          setTurnos(response.data);
        }
      } catch (error) {
        console.error("Error cargando pantalla pública", error);
      }
    };

    // Ejecutamos la primera carga de forma asíncrona segura
    void fetchTurnos();

    // Iniciamos el ciclo de actualización (Polling cada 5 segundos)
    const interval = setInterval(() => {
      void fetchTurnos();
    }, 5000);

    // Cleanup: Cuando se cierra la pantalla, limpiamos el intervalo y la bandera
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center border-b border-gray-700 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-blue-400">
            TURNOS EN ESPERA
          </h1>
          <p className="text-gray-400 mt-1">Smart Triage - Sala de Espera</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turnos.length > 0 ? (
          turnos.map((t) => (
            <div
              key={t.turnoId}
              className={`p-6 rounded-2xl border-l-8 shadow-2xl ${
                t.prioridad === 1
                  ? "bg-red-900/40 border-red-500"
                  : t.prioridad <= 3
                    ? "bg-yellow-900/40 border-yellow-500"
                    : "bg-gray-800 border-green-500"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-5xl font-black">#{t.turnoId}</span>
                <span className="text-xs uppercase font-bold bg-white/10 px-2 py-1 rounded">
                  Nivel {t.prioridad}
                </span>
              </div>
              <div className="text-xl font-semibold truncate">
                {t.pacienteNombre}
              </div>
              <div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {t.estado.replace("_", " ")}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-600 text-2xl">
            No hay turnos pendientes en este momento
          </div>
        )}
      </div>
    </div>
  );
};
