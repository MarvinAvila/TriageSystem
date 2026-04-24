import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './pages/auth/LoginView';
import { RecepcionView } from './pages/recepcion/RecepcionView';
import { MedicoView } from './pages/medico/MedicoView';
import { PantallaView } from './pages/pantalla/PantallaView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta base redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rutas Oficiales del Sistema Triage */}
        <Route path="/login" element={<LoginView />} />
        <Route path="/recepcion" element={<RecepcionView />} />
        <Route path="/medico" element={<MedicoView />} />
        <Route path="/pantalla" element={<PantallaView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;