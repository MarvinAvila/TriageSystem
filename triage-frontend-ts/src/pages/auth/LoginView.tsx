import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { type UsuarioAuth } from "../../types";
import axios from "axios";

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
      }>("/auth/login", {
        login,
        passwordPlan,
      });

      const usuarioAuth = response.data.usuario;

      loginStore(usuarioAuth);

      if (usuarioAuth.rol === "recepcion") navigate("/recepcion");
      else if (usuarioAuth.rol === "medico") navigate("/medico");
      else if (usuarioAuth.rol === "pantalla") navigate("/pantalla");
      else setError("Rol no reconocido para esta interfaz.");
    } catch (err) {

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Error de conexión con el servidor",
        );
      } else {
        setError("Ocurrió un error inesperado en el navegador");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Smart Triage</h2>
          <p className="text-gray-500 mt-2">Ingreso al sistema clínico</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ej. recepcion1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={passwordPlan}
              onChange={(e) => setPasswordPlan(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400"
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};
