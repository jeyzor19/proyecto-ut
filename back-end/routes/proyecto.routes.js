const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyecto.controller');

// Crear proyecto
router.post('/', proyectoController.crearProyecto);

module.exports = router;

