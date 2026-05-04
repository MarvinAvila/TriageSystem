# 🏥 Smart Triage System - Frontend Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%23443E38.svg?style=for-the-badge&logo=react&logoColor=white)

Cliente web para el **Sistema de Triage Inteligente**, una aplicación orientada a la gestión clínica y distribución de pacientes en tiempo real. Construido con una arquitectura moderna que garantiza la seguridad de las rutas, la persistencia de sesiones y una experiencia de usuario (UX) optimizada para entornos médicos de alta presión.

## ✨ Características Principales por Módulo

### 1. 🛡️ Autenticación y Seguridad
* **Rutas Protegidas (`ProtectedRoute`):** Control de acceso estricto basado en roles. Los usuarios son redirigidos automáticamente según su nivel de permisos.
* **Persistencia de Sesión:** Integración con el middleware `persist` de Zustand para mantener la sesión activa en el `localStorage`, sobreviviendo a recargas del navegador.
* **Patrón Diccionario:** Enrutamiento dinámico O(1) tras el login para escalabilidad futura de roles.

### 2. 📝 Módulo de Recepción
* Captura eficiente de datos del paciente (Personales y Evaluación Inicial).
* Registro de signos vitales (Temperatura, Frecuencia Cardíaca, Saturación de O2).
* Interfaz dividida en tarjetas (Grid) para reducir la carga cognitiva del operador.
* Feedback inmediato visual con limpieza automática de formulario al generar un turno.

### 3. 🩺 Panel del Médico (Consultorio)
* **Dashboard Dinámico:** Visualización completa del paciente (Edad, CURP, Signos Vitales y Motivo de Consulta).
* **Alertas Visuales de Triage:** La tarjeta de atención cambia de color basándose en un estándar médico de 5 niveles (Desde Nivel 1 Rojo hasta Nivel 5 Azul).
* Manejo seguro de "Cola Vacía" con estados de interfaz relajantes.

### 4. 📺 Pantalla Pública (Sala de Espera)
* Diseño *Split Screen* de alto contraste optimizado para legibilidad a distancia.
* Polling asíncrono para actualización en tiempo real de la cola.
* Reloj integrado y animaciones de "pulso" para alertar al paciente actual de pasar a consultorio.

---

## 🛠️ Stack Tecnológico

* **Core:** React 18 + TypeScript.
* **Bundler:** Vite (Rendimiento ultrarrápido en desarrollo).
* **Estilos:** Tailwind CSS v4 (Configuración moderna y optimizada).
* **Gestor de Estado:** Zustand (Global store ligero y persistente).
* **Peticiones HTTP:** Axios (Con interceptores y configuración para bypass de túneles).
* **Enrutamiento:** React Router v6.

---

## 🚀 Instalación y Configuración Local

### Prerrequisitos
* Node.js (v18 o superior recomendado)
* npm o yarn

### Pasos
1. Clona el repositorio e ingresa al directorio del frontend:
   ```bash
   cd triage-frontend-ts
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del frontend basándote en el entorno.
   ```env
   # Ejemplo apuntando a un túnel de ngrok para desarrollo distribuido
   VITE_API_URL=[https://tu-url-de-ngrok.ngrok-free.dev/api](https://tu-url-de-ngrok.ngrok-free.dev/api)
   ```
   *Nota: La configuración de Axios en `src/services/api.ts` ya incluye la cabecera `ngrok-skip-browser-warning: true` para evitar bloqueos por parte del túnel.*

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## 📂 Arquitectura de Carpetas

La aplicación sigue un patrón modular limpio para facilitar la escalabilidad:
```text
src/
├── assets/         # Imágenes, iconos y recursos estáticos
├── components/     # Componentes reutilizables (ej. ProtectedRoute)
├── pages/          # Vistas principales separadas por módulo (auth, medico, etc.)
├── services/       # Lógica de comunicación con APIs externas (Axios)
├── store/          # Estado global de la aplicación (Zustand)
├── types/          # Interfaces y tipado de TypeScript
├── App.tsx         # Configuración del Router y protección de rutas
└── main.tsx        # Punto de entrada de React e inyección de Tailwind
```

---

## 👨‍💻 Autor

Desarrollado por **Marvin Edel Rivera Avila (Hunter)**.
Proyecto para la **Facultad de Tecnologías Digitales Aplicadas (UNACH - Campus Tapachula)**.
```
