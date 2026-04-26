// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './pages/auth/LoginView';
import { PantallaView } from './pages/pantalla/PantallaView';
import { RecepcionView } from './pages/recepcion/RecepcionView';
import { MedicoView } from './pages/medico/MedicoView';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (No requieren sesión) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* La pantalla pública suele dejarse libre, o podrías protegerla solo para el rol 'pantalla' */}
        <Route path="/pantalla" element={<PantallaView />} />
        
        {/* Solo usuarios con rol 'recepcion' pueden entrar aquí */}
        <Route element={<ProtectedRoute allowedRoles={['recepcion']} />}>
          <Route path="/recepcion" element={<RecepcionView />} />
        </Route>

        {/* Solo usuarios con rol 'medico' pueden entrar aquí */}
        <Route element={<ProtectedRoute allowedRoles={['medico']} />}>
          <Route path="/medico" element={<MedicoView />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;