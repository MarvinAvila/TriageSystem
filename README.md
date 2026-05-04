# 🏥 Smart Triage System

Un sistema integral cliente-servidor para la gestión clínica y triaje médico[cite: 1]. Esta plataforma optimiza el flujo de atención a pacientes mediante la asignación de turnos, evaluación de síntomas (triaje) y visualización en tiempo real a través de diferentes paneles de control para el personal médico y administrativo[cite: 1].

El proyecto está estructurado en un único repositorio que contiene tanto el Frontend como el Backend, facilitando el desarrollo y despliegue continuo[cite: 1].

---

## 📋 Tabla de Contenidos

1. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
2. [Características Principales](#-características-principales)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estructura de Directorios](#-estructura-de-directorios)
5. [Requisitos Previos](#-requisitos-previos)
6. [Instalación y Configuración](#-instalación-y-configuración)
7. [Base de Datos](#-base-de-datos)

---

## 🏗 Arquitectura del Proyecto

El sistema está dividido en dos aplicaciones principales:

- **Frontend (`triage-frontend-ts/`)**: Una SPA (Single Page Application) construida para ser rápida y reactiva, dividida por interfaces de usuario según el rol (Recepción, Médico y Pantalla de espera)[cite: 1].
- **Backend (`triage-backend-ts/`)**: Una API RESTful robusta implementada bajo los principios de **Clean Architecture** (Dominio, Aplicación e Infraestructura) para garantizar un código escalable, testeable y mantenible[cite: 1].

---

## ✨ Características Principales

- **Sistema de Autenticación**: Gestión segura de sesiones (`AuthController`, `LoginView.tsx`) y protección de rutas (`ProtectedRoute.tsx`)[cite: 1].
- **Motor de Prioridad (Triage)**: Lógica de negocio dedicada a calcular la prioridad de los pacientes basándose en sus síntomas (`PrioridadEngine.ts`, `TriageService.ts`)[cite: 1].
- **Módulo de Recepción**: Interfaz para el registro de nuevos pacientes y asignación inicial de turnos (`RecepcionView.tsx`, `TurnoRegistroDTO.ts`)[cite: 1].
- **Panel Médico**: Dashboard exclusivo para el personal médico, permitiendo la atención de pacientes según su nivel de urgencia (`MedicoView.tsx`)[cite: 1].
- **Pantalla Pública**: Vista en tiempo real diseñada para las salas de espera, mostrando los turnos llamados y próximos a atender (`PantallaView.tsx`, `TurnoPublicoDTO.ts`)[cite: 1].
- **Gestión de Bitácoras e Historial**: Trazabilidad completa de las acciones del sistema (`Bitacora.ts`)[cite: 1].

---

## 💻 Stack Tecnológico

### Frontend[cite: 1]
* **Lenguaje:** TypeScript
* **Librería Core:** React
* **Build Tool:** Vite (`vite.config.ts`)
* **Estilos:** Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
* **Gestión del Estado:** Zustand / Custom Stores (`authStore.ts`)

### Backend[cite: 1]
* **Lenguaje:** TypeScript (`tsconfig.json`)
* **Entorno:** Node.js
* **Base de Datos:** PostgreSQL (`pgConfig.ts`)
* **Arquitectura:** Clean Architecture

---

## 📂 Estructura de Directorios
```
TriageSystem/
├── seeder.sql                   # Script de inicialización de la base de datos[cite: 1]
├── triage-backend-ts/           # API Backend[cite: 1]
│   ├── .env.example             # Plantilla de variables de entorno[cite: 1]
│   └── src/
│       ├── application/         # Casos de uso, Servicios (TriageService) y DTOs[cite: 1]
│       ├── domain/              # Modelos de negocio (Paciente, Turno, Sintomas)[cite: 1]
│       ├── infrastructure/      # Controladores, Repositorios y Config. de BD (PostgreSQL)[cite: 1]
│       └── server.ts            # Punto de entrada de la aplicación[cite: 1]
└── triage-frontend-ts/          # Aplicación Frontend[cite: 1]
    ├── .env                     # Variables de entorno del cliente[cite: 1]
    └── src/
        ├── assets/              # Recursos estáticos e imágenes[cite: 1]
        ├── components/          # Componentes reutilizables y layouts (ProtectedRoute)[cite: 1]
        ├── pages/               # Vistas principales (Auth, Medico, Pantalla, Recepcion)[cite: 1]
        ├── services/            # Clientes HTTP (api.ts)[cite: 1]
        ├── store/               # Gestores de estado global (authStore.ts)[cite: 1]
        └── types/               # Definiciones de tipos e interfaces[cite: 1]
```

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno local:
- [Node.js](https://nodejs.org/) (v18 o superior)
- [PostgreSQL](https://www.postgresql.org/) para la base de datos distribuida[cite: 1].
- Administrador de paquetes npm o yarn.

---

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo localmente.

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd TriageSystem
```

### 2. Configuración del Backend[cite: 1]
```bash
cd triage-backend-ts

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus credenciales de PostgreSQL y secretos JWT
```

### 3. Configuración del Frontend[cite: 1]
En una nueva terminal:
```bash
cd triage-frontend-ts

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

---

## 🗄️ Base de Datos

El proyecto incluye un archivo `seeder.sql` en la raíz del repositorio[cite: 1]. Este archivo contiene la estructura inicial (DDL) y datos semilla necesarios para hacer pruebas en el sistema (usuarios de prueba, configuración de catálogos médicos, etc.)[cite: 1].

Para inicializar la base de datos, ejecuta el script en tu cliente PostgreSQL:
```bash
psql -U tu_usuario -d tu_base_de_datos -f ../seeder.sql
```
*(Asegúrate de ejecutar esto antes de levantar el backend para evitar errores de conexión mediante el `pgConfig.ts`)*[cite: 1].

---

**Desarrollado con ❤️ para optimizar la atención médica.**
