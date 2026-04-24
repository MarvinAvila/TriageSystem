import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface PacienteAtendido {
    turnoId: number;
    nombre: string;
    prioridad: number;
    motivo: string;
}

export const MedicoView = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState<PacienteAtendido | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const llamarSiguiente = async () => {
        setLoading(true);
        setError('');
        try {
            // Llamamos al endpoint que configuramos en el backend distribuido
            const response = await api.post(`/turnos/llamar/${user?.id}`);
            setPaciente({
                turnoId: response.data.turnoId,
                nombre: response.data.paciente,
                prioridad: response.data.prioridad || 0,
                motivo: response.data.motivo || 'Consulta general'
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'No hay pacientes en espera');
            }
            setPaciente(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">👨‍⚕️ Panel del Médico</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm bg-green-800 px-3 py-1 rounded-full">Dr. {user?.login}</span>
                    <button onClick={() => { logout(); navigate('/login'); }} className="hover:underline">Salir</button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto p-6 mt-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                    <h2 className="text-gray-500 font-medium uppercase tracking-widest mb-2">Paciente en Atención</h2>
                    
                    {paciente ? (
                        <div className="animate-fade-in">
                            <div className="text-5xl font-black text-gray-800 mb-2">#{paciente.turnoId}</div>
                            <div className="text-2xl font-bold text-green-600 mb-4">{paciente.nombre}</div>
                            <div className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 font-bold mb-6">
                                Prioridad Nivel {paciente.prioridad}
                            </div>
                            <p className="text-gray-600 italic">" {paciente.motivo} "</p>
                        </div>
                    ) : (
                        <div className="py-10 text-gray-400">
                            <div className="text-6xl mb-4">💤</div>
                            <p>No hay pacientes asignados actualmente</p>
                        </div>
                    )}

                    {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}

                    <button 
                        onClick={llamarSiguiente}
                        disabled={loading}
                        className="mt-10 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-green-200 disabled:bg-gray-300"
                    >
                        {loading ? 'Llamando...' : 'Llamar Siguiente Paciente'}
                    </button>
                </div>
            </div>
        </div>
    );
};