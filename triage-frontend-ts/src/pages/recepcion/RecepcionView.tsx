import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { type TurnoRegistroDTO } from "../../types";
import axios from "axios";

export const RecepcionView = () => {
  // Obtenemos al recepcionista que inició sesión y la función para salir
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [curp, setCurp] = useState("");
  const [edad, setEdad] = useState<number | "">("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [temperatura, setTemperatura] = useState<number | "">("");
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState<number | "">("");
  const [saturacionOxigeno, setSaturacionOxigeno] = useState<number | "">("");

  const [mensaje, setMensaje] = useState<{
    texto: string;
    tipo: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setLoading(true);

    // Construimos el DTO exactamente como lo espera tu backend
    const turnoData: TurnoRegistroDTO = {
      paciente: {
        nombre,
        curp: curp.toUpperCase(),
        edad: Number(edad),
      },
      motivoConsulta,
      signosVitales: {
        temperatura: Number(temperatura),
        frecuenciaCardiaca: Number(frecuenciaCardiaca),
        saturacionOxigeno: Number(saturacionOxigeno),
      },
      recepcionistaId: user?.id || 0,
    };

    try {
      // Mandamos el JSON al backend distribuido
      const response = await api.post("/turnos", turnoData);

      setMensaje({
        texto: `¡Turno generado! Prioridad asignada: Nivel ${response.data.prioridad}`,
        tipo: "success",
      });

      // Limpiamos el formulario para el siguiente paciente
      setNombre("");
      setCurp("");
      setEdad("");
      setMotivoConsulta("");
      setTemperatura("");
      setFrecuenciaCardiaca("");
      setSaturacionOxigeno("");
    } catch (error) {
      // <-- Eliminamos el ': any'
      // Verificamos de manera segura si el error viene de tu backend
      if (axios.isAxiosError(error)) {
        setMensaje({
          texto: error.response?.data?.error || "Error al registrar paciente",
          tipo: "error",
        });
      } else {
        setMensaje({
          texto: "Ocurrió un error inesperado al conectar con el servidor",
          tipo: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">🏥 Smart Triage - Recepción</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">
            Operador: {user?.login}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm hover:underline font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenedor Principal */}
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Registro de Nuevo Paciente
        </h2>

        {mensaje && (
          <div
            className={`p-4 rounded-lg mb-6 text-center font-medium ${mensaje.tipo === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección: Datos del Paciente */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              👤 Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CURP
                </label>
                <input
                  type="text"
                  required
                  value={curp}
                  onChange={(e) => setCurp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  maxLength={18}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={edad}
                  onChange={(e) =>
                    setEdad(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sección: Triage Clínico */}
          <div className="bg-red-50 p-5 rounded-lg border border-red-100">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              🩺 Evaluación Inicial (Triage)
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de Consulta (Síntomas principales)
              </label>
              <textarea
                required
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={temperatura}
                  onChange={(e) =>
                    setTemperatura(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ej. 37.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frecuencia Cardíaca (lpm)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={frecuenciaCardiaca}
                  onChange={(e) =>
                    setFrecuenciaCardiaca(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ej. 80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saturación Oxígeno (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={saturacionOxigeno}
                  onChange={(e) =>
                    setSaturacionOxigeno(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ej. 98"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:bg-blue-400"
            >
              {loading
                ? "Calculando Prioridad y Registrando..."
                : "Registrar Paciente y Generar Turno"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
