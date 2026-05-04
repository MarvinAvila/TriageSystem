import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";

export const RecepcionView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [curp, setCurp] = useState("");
  const [edad, setEdad] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState("");
  const [saturacionOxigeno, setSaturacionOxigeno] = useState("");

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError("Error de sesión: No se pudo identificar al operador.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Estructura basada en tu TurnoRegistroDTO
      const payload = {
        recepcionistaId: user.id,
        paciente: {
          nombre,
          curp,
          edad: parseInt(edad, 10),
        },
        motivoConsulta,
        signosVitales: {
          temperatura: parseFloat(temperatura),
          frecuenciaCardiaca: parseInt(frecuenciaCardiaca, 10),
          saturacionOxigeno: parseInt(saturacionOxigeno, 10),
        },
      };

      await api.post("/turnos", payload);

      setSuccess(`¡Turno generado exitosamente para ${nombre}!`);

      // Limpiamos el formulario para el siguiente paciente
      setNombre("");
      setCurp("");
      setEdad("");
      setMotivoConsulta("");
      setTemperatura("");
      setFrecuenciaCardiaca("");
      setSaturacionOxigeno("");

      // Quitamos el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al registrar el turno.");
      } else {
        setError("Ocurrió un error inesperado al procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Navigation Bar */}
      <nav className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <h1 className="text-xl font-bold tracking-wide">
            Smart Triage{" "}
            <span className="font-light text-blue-200">| Recepción</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
              Operador Activo
            </span>
            <span className="text-sm font-bold">{user?.login}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-600 border border-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">
            Registro de Nuevo Paciente
          </h2>
          <p className="text-gray-500">
            Capture los datos iniciales para asignar una prioridad en la sala de
            espera.
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border-l-4 border-red-500 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border-l-4 border-green-500 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta: Datos Personales */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <span>👤</span> Datos Personales
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CURP
                  </label>
                  <input
                    type="text"
                    required
                    value={curp}
                    onChange={(e) => setCurp(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
                    placeholder="18 caracteres"
                    maxLength={18}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Edad
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Años cumplidos"
                  />
                </div>
              </div>
            </div>

            {/* Tarjeta: Evaluación Inicial */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <span>🩺</span> Evaluación Inicial (Triage)
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Motivo de Consulta (Síntomas)
                  </label>
                  <textarea
                    required
                    value={motivoConsulta}
                    onChange={(e) => setMotivoConsulta(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Describa brevemente los síntomas principales..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Temp. (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={temperatura}
                      onChange={(e) => setTemperatura(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="37.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Frec. Cardíaca
                    </label>
                    <input
                      type="number"
                      required
                      value={frecuenciaCardiaca}
                      onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="80 lpm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Sat. O2 (%)
                    </label>
                    <input
                      type="number"
                      required
                      value={saturacionOxigeno}
                      onChange={(e) => setSaturacionOxigeno(e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="98%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto md:px-12 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:bg-blue-400 text-lg flex justify-center items-center gap-2"
            >
              {loading
                ? "Generando Turno..."
                : "Registrar Paciente y Generar Turno"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
