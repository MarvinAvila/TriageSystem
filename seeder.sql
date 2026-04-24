-- =====================================================================
-- SEEDER: Datos de prueba para Smart Triage System
-- =====================================================================

-- 1. Limpiar las tablas (CASCADE elimina las dependencias y RESTART IDENTITY reinicia los IDs a 1)
TRUNCATE TABLE bitacora, sintomas, turno, paciente, usuario RESTART IDENTITY CASCADE;

-- 2. Poblar USUARIOS (Personal de la clínica)
-- Nota: La contraseña plana coincide con el hash por la lógica temporal del AuthService
INSERT INTO usuario (login, hash, rol, activo) VALUES
('admin', 'admin123', 'admin', true),
('recepcion1', 'recepcion123', 'recepcion', true),
('medico1', 'medico123', 'medico', true),
('pantalla1', 'pantalla123', 'pantalla', true);

-- 3. Poblar PACIENTES
INSERT INTO paciente (nombre, curp, edad) VALUES
('Juan Pérez', 'JUPR800101HDFRXX01', 45),
('María García', 'MAGA900202MDFRXX02', 34),
('Carlos López', 'CALO700303HDFRXX03', 56),
('Ana Martínez', 'ANMA000404MDFRXX04', 24);

-- 4. Poblar TURNOS (Estado: EN_COLA)
-- Asignamos pacientes (1, 2, 3) al recepcionista (2)
INSERT INTO turno (paciente_id, recepcionista_id, prioridad, estado) VALUES
(1, 2, 3, 'EN_COLA'), -- Prioridad 3 (Urgencia)
(2, 2, 5, 'EN_COLA'), -- Prioridad 5 (No urgente)
(3, 2, 1, 'EN_COLA'); -- Prioridad 1 (Resucitación - ¡Este debería ser llamado primero!)

-- 5. Poblar SÍNTOMAS (Relacionados 1 a 1 con los Turnos)
-- Usamos el formato JSONB para los signos vitales
INSERT INTO sintomas (turno_id, motivo_consulta, signos_vitales, prioridad_calculada) VALUES
(1, 'Dolor abdominal y fiebre moderada', '{"temperatura": 38.5, "frecuenciaCardiaca": 115, "saturacionOxigeno": 96}', 3),
(2, 'Dolor de cabeza leve y tos', '{"temperatura": 37.2, "frecuenciaCardiaca": 80, "saturacionOxigeno": 98}', 5),
(3, 'Dificultad severa para respirar, presión en el pecho', '{"temperatura": 36.5, "frecuenciaCardiaca": 140, "saturacionOxigeno": 85}', 1);

-- Mostrar resumen en consola
SELECT '¡Datos sembrados con éxito!' as resultado;