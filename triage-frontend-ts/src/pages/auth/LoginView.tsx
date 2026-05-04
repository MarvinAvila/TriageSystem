import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { type UsuarioAuth } from "../../types";
import axios from "axios";
import heroImg from "../../assets/hero.png"; // Aprovechamos tu asset

export const LoginView = () => {
  const [login, setLogin] = useState("");
  const [passwordPlan, setPasswordPlan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<{
        mensaje: string;
        usuario: UsuarioAuth;
      }>("/auth/login", { login, passwordPlan });

      const usuarioAuth = response.data.usuario;
      loginStore(usuarioAuth);

      // Aplicamos el patrón de diccionario que definimos anteriormente
      const rutasPorRol: Record<string, string> = {
        recepcion: "/recepcion",
        medico: "/medico",
        pantalla: "/pantalla",
      };

      const rutaDestino = rutasPorRol[usuarioAuth.rol];
      if (rutaDestino) navigate(rutaDestino);
      else setError("Rol no reconocido para esta interfaz.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Error de conexión con el servidor",
        );
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Columna Izquierda: Identidad Visual (Oculta en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-extrabold mb-6">Smart Triage</h1>
          <p className="text-xl text-blue-100 max-w-md leading-relaxed">
            Gestión clínica inteligente y distribución de pacientes en tiempo
            real. Optimice la atención desde el primer contacto.
          </p>
          <img
            src={heroImg}
            alt="Medical Hero"
            className="mt-12 w-full max-w-lg rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </div>
        {/* Decoración abstracta */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Ingrese sus credenciales para acceder
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center">
              <span className="text-red-700 text-sm font-semibold">
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="nombre.usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                value={passwordPlan}
                onChange={(e) => setPasswordPlan(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-blue-300 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Smart Triage System. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
