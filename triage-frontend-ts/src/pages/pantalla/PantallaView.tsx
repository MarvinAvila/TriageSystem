import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { type TurnoPublicoDTO } from "../../types";

// Helper UI para los colores en la sala de espera
const getFilaStyles = (prioridad: number) => {
  switch (prioridad) {
    case 1:
      return {
        border: "border-red-500",
        bg: "bg-red-50",
        text: "text-red-700",
      };
    case 2:
      return {
        border: "border-orange-500",
        bg: "bg-orange-50",
        text: "text-orange-700",
      };
    case 3:
      return {
        border: "border-yellow-400",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
      };
    case 4:
      return {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
      };
    case 5:
      return {
        border: "border-blue-400",
        bg: "bg-blue-50",
        text: "text-blue-700",
      };
    default:
      return {
        border: "border-gray-300",
        bg: "bg-gray-50",
        text: "text-gray-700",
      };
  }
};

export const PantallaView = () => {
  const [turnos, setTurnos] = useState<TurnoPublicoDTO[]>([]);
  const [horaLocal, setHoraLocal] = useState<string>("");

  // Reloj en tiempo real
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setHoraLocal(
        now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      );
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Polling de Turnos
  useEffect(() => {
    let isMounted = true;

    const fetchTurnos = async () => {
      try {
        const response = await api.get<TurnoPublicoDTO[]>("/turnos/publicos");
        if (isMounted) {
          setTurnos(response.data);
        }
      } catch (error) {
        console.error("Error cargando pantalla pública", error);
      }
    };

    void fetchTurnos();
    const interval = setInterval(() => {
      void fetchTurnos();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Separamos los turnos por su estado
  // Asumimos que los "ATENDIENDO" recientes vienen en el arreglo
  const pacientesLlamados = turnos
    .filter((t) => t.estado === "ATENDIENDO")
    .slice(0, 3);
  const pacientesEnEspera = turnos.filter((t) => t.estado === "EN_COLA");

  const turnoActual = pacientesLlamados[0]; // El más reciente

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans overflow-hidden">
      {/* Header Oscuro y Elegante */}
      <header className="bg-black/40 text-white py-6 px-10 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🏥</span>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Smart Triage
            </h1>
            <p className="text-gray-400 text-lg uppercase tracking-widest mt-1">
              Sala de Espera Principal
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-light tracking-tighter">
            {horaLocal}
          </div>
        </div>
      </header>

      {/* Contenido Principal (Split Screen) */}
      <main className="flex-1 flex p-8 gap-8">
        {/* Columna Izquierda: TURNO ACTUAL (El que acaba de ser llamado) */}
        <section className="w-2/3 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
          <div className="bg-teal-600 text-white text-center py-4">
            <h2 className="text-3xl font-bold uppercase tracking-widest">
              Pasar a Consultorio
            </h2>
          </div>

          {turnoActual ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
              {/* Animación sutil de pulso para llamar la atención */}
              <div className="absolute inset-0 border-[12px] border-teal-500 rounded-3xl animate-pulse opacity-20 pointer-events-none"></div>

              <span className="text-3xl font-bold text-gray-400 uppercase tracking-widest mb-4">
                Turno
              </span>
              <div className="text-[10rem] leading-none font-black text-gray-900 mb-8 tracking-tighter">
                #{turnoActual.turnoId}
              </div>
              <h3 className="text-7xl font-extrabold text-teal-700 leading-tight">
                {turnoActual.pacienteNombre}
              </h3>
              <p className="mt-12 text-3xl text-gray-500 font-medium">
                Por favor, diríjase con el médico.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <span className="text-8xl mb-6">🩺</span>
              <p className="text-3xl font-medium text-gray-400">
                Esperando al siguiente paciente...
              </p>
            </div>
          )}
        </section>

        {/* Columna Derecha: PRÓXIMOS EN COLA */}
        <section className="w-1/3 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-3xl p-6 shadow-xl flex-1 flex flex-col border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
              <span>📋</span> En Espera
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {pacientesEnEspera.length > 0 ? (
                pacientesEnEspera.map((t) => {
                  const styles = getFilaStyles(t.prioridad);
                  return (
                    <div
                      key={t.turnoId}
                      className={`p-5 rounded-2xl border-l-8 shadow-lg ${styles.bg} ${styles.border} flex justify-between items-center`}
                    >
                      <div>
                        <div className="text-2xl font-black text-gray-900">
                          #{t.turnoId}
                        </div>
                        <div
                          className={`text-lg font-bold ${styles.text} truncate max-w-[200px]`}
                        >
                          {t.pacienteNombre}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold uppercase tracking-widest ${styles.text}`}
                        >
                          Prioridad
                        </span>
                        <div className={`text-3xl font-black ${styles.text}`}>
                          {t.prioridad}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-10 mt-10">
                  <p className="text-xl">No hay pacientes en cola</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
