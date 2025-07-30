const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const rolRoutes = require('./rol.routes');
const departamentoRoutes = require('./departamento.routes');
const proyectoRoutes = require('./proyecto.routes');
// Aquí luego puedes agregar más rutas, como:
// const proyectoRoutes = require('./proyecto.routes');

router.use('/api', authRoutes);
router.use('/api/usuarios', usuarioRoutes);
router.use('/api/roles', rolRoutes);
router.use('/api/departamentos', require('./departamento.routes'));
router.use('/api/proyectos', proyectoRoutes);

module.exports = router;
