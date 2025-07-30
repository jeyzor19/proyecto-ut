-- Insert sample users into the usuario table
INSERT INTO `usuario` (`nombre`, `apellidos`, `correo`, `contrasena`, `id_rol`) VALUES 
('Juan Carlos', 'García López', 'jgarcia@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1), -- Admin
('María Elena', 'Rodríguez Martínez', 'mrodriguez@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2), -- DepLider
('Carlos Alberto', 'Hernández Silva', 'chernandez@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2), -- DepLider
('Ana Sofía', 'López Fernández', 'alopez@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3), -- Usuario
('Roberto Miguel', 'Sánchez Torres', 'rsanchez@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3), -- Usuario
('Lucía Isabel', 'Morales Vega', 'lmorales@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3), -- Usuario
('Fernando José', 'Jiménez Ruiz', 'fjimenez@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2), -- DepLider
('Patricia Carmen', 'Vargas Castillo', 'pvargas@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3), -- Usuario
('Diego Alejandro', 'Mendoza Pérez', 'dmendoza@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3), -- Usuario
('Gabriela Alejandra', 'Cruz Ramírez', 'gcruz@uttn.mx', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3); -- Usuario

-- Insert relationships between users and departments in usuariodepartamento table
-- Assuming the users were inserted with auto-increment IDs starting from 1

-- Juan Carlos García (Admin) - belongs to Rectoria
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (1, 1);

-- María Elena Rodríguez (DepLider) - belongs to Sistemas y Telecomunicaciones
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (2, 5);

-- Carlos Alberto Hernández (DepLider) - belongs to Ingeniería Industrial
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (3, 17);

-- Ana Sofía López (Usuario) - belongs to Sistemas y Telecomunicaciones
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (4, 5);

-- Roberto Miguel Sánchez (Usuario) - belongs to Administración y Finanzas
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (5, 4);

-- Lucía Isabel Morales (Usuario) - belongs to Mecatrónica
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (6, 10);

-- Fernando José Jiménez (DepLider) - belongs to Logística
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (7, 14);

-- Patricia Carmen Vargas (Usuario) - belongs to Servicios Escolares
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (8, 8);

-- Diego Alejandro Mendoza (Usuario) - belongs to Energía y Desarrollo Sostenible
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (9, 12);

-- Gabriela Alejandra Cruz (Usuario) - belongs to Tecnologías de la Información
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (10, 16);

-- Additional department assignments (some users can belong to multiple departments)
-- María Elena also supports Tecnologías de la Información
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (2, 16);

-- Juan Carlos (Admin) also oversees Planeación y Evaluación
INSERT INTO `usuariodepartamento` (`id_usuario`, `id_departamento`) VALUES (1, 2);