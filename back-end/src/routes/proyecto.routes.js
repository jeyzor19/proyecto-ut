const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyecto.controller');
const {
  marcarComoCompletado,
  eliminarProyecto,
  obtenerProyectosEliminados,
} = require('../controllers/proyecto.controller');

// Crear proyecto
router.post('/', proyectoController.crearProyecto);
router.get(
  '/porid/:usuarioId/:proyectoId',
  proyectoController.obtenerProyectoPorId
);
router.get('/usuario/:idUsuario', proyectoController.obtenerProyecto);
router.put('/:id/completar', marcarComoCompletado);
router.put('/eliminar/:id', eliminarProyecto);
router.get('/eliminados', obtenerProyectosEliminados);

module.exports = router;
