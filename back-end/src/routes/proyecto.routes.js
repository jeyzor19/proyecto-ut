const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyecto.controller');
const { marcarComoCompletado, eliminarProyecto, obtenerProyectosEliminados, reactivarProyecto } = require('../controllers/proyecto.controller');


// Crear proyecto
router.post('/', proyectoController.crearProyecto);
router.get('/usuario/:idUsuario', proyectoController.obtenerProyecto);
router.put('/:id/completar', marcarComoCompletado);
router.put('/eliminar/:id', eliminarProyecto);
router.get('/eliminados', obtenerProyectosEliminados);
router.put('/reactivar/:id', reactivarProyecto); // ✅ Esta es la que necesitas



module.exports = router;
