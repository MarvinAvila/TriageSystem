import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

// 1. Ampliamos las interfaces para recibir la nueva data
interface SignosVitales {
  temperatura?: number;
  frecuenciaCardiaca?: number;
  saturacionOxigeno?: number;
}

interface PacienteAtendido {
  turnoId: number;
  nombre: string;
  edad: number;
  curp: string;
  prioridad: number;
  motivo: string;
  signosVitales: SignosVitales;
}

const getPriorityStyles = (prioridad: number) => {
  switch (prioridad) {
    case 1:
      return {
        bg: "bg-red-50",
        border: "border-red-500",
        text: "text-red-800",
        badge: "bg-red-600 text-white",
        label: "Nivel 1 - Resucitación",
      };
    case 2:
      return {
        bg: "bg-orange-50",
        border: "border-orange-500",
        text: "text-orange-800",
        badge: "bg-orange-500 text-white",
        label: "Nivel 2 - Emergencia",
      };
    case 3:
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-400",
        text: "text-yellow-800",
        badge: "bg-yellow-400 text-gray-900",
        label: "Nivel 3 - Urgencia",
      };
    case 4:
      return {
        bg: "bg-green-50",
        border: "border-green-500",
        text: "text-green-800",
        badge: "bg-green-500 text-white",
        label: "Nivel 4 - Urgencia Menor",
      };
    case 5:
      return {
        bg: "bg-blue-50",
        border: "border-blue-400",
        text: "text-blue-800",
        badge: "bg-blue-500 text-white",
        label: "Nivel 5 - Sin Urgencia",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-800",
        badge: "bg-gray-500 text-white",
        label: "No Clasificado",
      };
  }
};

export const MedicoView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<PacienteAtendido | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [error, setError] = useState("");

  const llamarSiguiente = async () => {
    if (!user?.id) {
      setError("Sesión inválida. Vuelve a iniciar sesión.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await api.post(`/turnos/llamar/${user.id}`);

      if (!response.data.turnoId) {
        setPaciente(null);
        setInfoMessage(
          response.data.mensaje ||
            "No hay pacientes en espera en este momento.",
        );
        return;
      }

      // 2. Extraemos toda la data nueva
      setPaciente({
        turnoId: response.data.turnoId,
        nombre: response.data.paciente,
        edad: response.data.edad,
        curp: response.data.curp,
        prioridad: response.data.prioridad || 0,
        motivo: response.data.motivo || "Consulta general",
        signosVitales: response.data.signosVitales || {},
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Error de conexión con el servidor",
        );
      } else {
        setError("Ocurrió un error inesperado al llamar al paciente.");
      }
      setPaciente(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const priorityStyles = paciente
    ? getPriorityStyles(paciente.prioridad)
    : null;

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <nav className="bg-teal-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🩺</span>
          <h1 className="text-xl font-bold tracking-wide">
            Smart Triage{" "}
            <span className="font-light text-teal-200">| Consultorio</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-teal-200 uppercase tracking-wider font-semibold">
              Médico en Turno
            </span>
            <span className="text-sm font-bold">Dr(a). {user?.login}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-teal-700 hover:bg-teal-600 border border-teal-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {paciente && priorityStyles ? (
            <div
              className={`p-10 border-t-8 ${priorityStyles.border} ${priorityStyles.bg} transition-colors duration-500`}
            >
              {/* Cabecera del Paciente */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Paciente en Atención
                  </h2>
                  <h3
                    className={`text-4xl font-extrabold ${priorityStyles.text} mb-2`}
                  >
                    {paciente.nombre}
                  </h3>
                  <div className="flex gap-4 text-sm font-semibold text-gray-600">
                    <span className="bg-white/50 px-3 py-1 rounded-md">
                      Edad: {paciente.edad} años
                    </span>
                    <span className="bg-white/50 px-3 py-1 rounded-md">
                      CURP: {paciente.curp}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    Turno
                  </span>
                  <div className="text-5xl font-black text-gray-900">
                    #{paciente.turnoId}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${priorityStyles.badge}`}
                >
                  {priorityStyles.label}
                </span>
              </div>

              {/* Síntomas y Motivo */}
              <div className="bg-white/60 p-6 rounded-2xl border border-white/40 shadow-sm mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Motivo de Consulta / Síntomas
                </h4>
                <p className="text-xl text-gray-800 font-medium leading-relaxed italic">
                  "{paciente.motivo}"
                </p>
              </div>

              {/* 3. Panel de Signos Vitales */}
              <div className="bg-white/60 p-6 rounded-2xl border border-white/40 shadow-sm">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span>❤️</span> Signos Vitales Recabados
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Temperatura
                    </span>
                    <span className="text-2xl font-extrabold text-gray-800">
                      {paciente.signosVitales.temperatura || "--"}
                      <span className="text-sm text-gray-400 ml-1">°C</span>
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Frec. Cardíaca
                    </span>
                    <span className="text-2xl font-extrabold text-gray-800">
                      {paciente.signosVitales.frecuenciaCardiaca || "--"}
                      <span className="text-sm text-gray-400 ml-1">lpm</span>
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Sat. Oxígeno
                    </span>
                    <span className="text-2xl font-extrabold text-gray-800">
                      {paciente.signosVitales.saturacionOxigeno || "--"}
                      <span className="text-sm text-gray-400 ml-1">%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center bg-gray-50">
              <div className="text-7xl mb-6 opacity-80">☕</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Consultorio Disponible
              </h3>
              <p className="text-gray-500 text-lg">
                {infoMessage ||
                  "Presione el botón inferior para llamar al siguiente paciente en la cola."}
              </p>
            </div>
          )}

          {error && (
            <div className="mx-10 mt-6 bg-red-50 text-red-700 p-4 rounded-xl border-l-4 border-red-500 font-medium text-center">
              {error}
            </div>
          )}

          <div className="p-10 bg-white border-t border-gray-100 flex justify-center">
            <button
              onClick={llamarSiguiente}
              disabled={loading}
              className="w-full max-w-lg bg-teal-600 hover:bg-teal-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-teal-200 transition-all active:scale-95 disabled:bg-gray-300 text-xl flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Llamando a recepción...
                </>
              ) : (
                <>
                  <span>📢</span> Llamar Siguiente Paciente
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
