# 🏥 Smart Triage System - Backend Node.js
### Sistema de Priorización Médica con Arquitectura Limpia y Base de Datos Distribuida

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Clean-Architecture-blue?style=for-the-badge)

## 📖 Descripción
Este es el motor de backend para el **Smart Triage System**, una aplicación cliente-servidor diseñada para optimizar la recepción de pacientes en entornos clínicos. El sistema utiliza un **algoritmo de priorización automática** basado en signos vitales y motivos de consulta, gestionando el flujo de pacientes mediante una arquitectura de microservicios y bases de datos distribuidas para garantizar alta disponibilidad y segregación de responsabilidades (CQRS).

## 🏗️ Arquitectura del Software
El proyecto implementa **Clean Architecture** (Arquitectura Limpia), separando el código en capas desacopladas:

- **Domain (Capa de Dominio):** Modelos de negocio, enums e interfaces puras. Sin dependencias externas.
- **Application (Capa de Aplicación):** Casos de uso (Servicios) y lógica de negocio core (Motor de Prioridad).
- **Infrastructure (Capa de Infraestructura):** Implementaciones técnicas como Repositorios (TypeORM/PG), Controladores web y configuración de base de datos distribuida.

### Gestión de Base de Datos Distribuida
El sistema está configurado para operar con una arquitectura de base de datos distribuida:
- **Write Pool (Primario):** Nodo maestro encargado de todas las operaciones de escritura (INSERT, UPDATE, DELETE).
- **Read Pool (Réplica):** Nodos encargados de las consultas (SELECT), optimizando el rendimiento de la aplicación y la pantalla pública de espera.

## 🚀 Características Principales
- **Motor de Prioridad Triage:** Algoritmo automático que clasifica pacientes de Nivel 1 (Resucitación) a Nivel 5 (No Urgente).
- **Autenticación Basada en Roles:** Gestión de accesos para Administradores, Recepcionistas y Médicos.
- **Gestión de Cola en Tiempo Real:** Algoritmos de ordenamiento que priorizan la gravedad clínica sobre el tiempo de llegada.
- **Endpoint Público para Sala de Espera:** API optimizada para la visualización de turnos en monitores públicos.

## 🛠️ Tecnologías
- **Lenguaje:** TypeScript 5.x
- **Runtime:** Node.js 20+
- **Framework Web:** Express.js
- **Base de Datos:** PostgreSQL con `pg-pool` para gestión de conexiones distribuidas.
- **Seguridad:** CORS habilitado y manejo de secretos mediante `.env`.
- **Despliegue:** Túneles seguros vía ngrok para pruebas remotas.

## 🚦 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Inicia sesión y retorna los datos del personal.

### Gestión de Turnos
- `POST /api/turnos` - Registra paciente, calcula prioridad y genera turno (Recepcionista).
- `POST /api/turnos/llamar/:medicoId` - Asigna el siguiente paciente más crítico al médico (Médico).
- `GET /api/turnos/publicos` - Retorna los turnos activos ordenados por prioridad para la sala de espera.

### Sistema
- `GET /api/health` - Verifica la salud del servidor y la conexión a los nodos de la BD.

## ⚙️ Configuración del Entorno

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` en la raíz:
   ```env
   PORT=8080
   DB_WRITE_HOST=tu_ip_primaria
   DB_READ_HOST=tu_ip_replica
   DB_USER=hunter
   DB_PASS=tu_password
   DB_NAME=triage_db
   ```
4. Ejecuta el script de base de datos:
   ```bash
   psql -U usuario -d triage_db -f seeder.sql
   ```

## 👨‍💻 Desarrollo

Para levantar el servidor en modo desarrollo con recarga automática:
```bash
npm run dev
```

Para exponer la API a internet mediante el túnel configurado:
```bash
ngrok http --domain=tu-dominio-fijo.ngrok-free.app 8080
```

## 🛡️ Seguridad
- El sistema utiliza restricciones `NOT NULL` y `CHECK` a nivel de base de datos.
- Se implementan transacciones SQL para asegurar la integridad entre las tablas `paciente`, `turno` y `sintomas`.

---
**Desarrollado por:** 
```
Marvin Edel Rivera Avila (AsHunter)
*8vo Semestre - Facultad de Tecnologías Digitales Aplicadas (UNACH)*
```
