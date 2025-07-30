const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamento.controller');

router.get('/', departamentoController.obtenerDepartamentos);
router.get('/usuario/:id', departamentoController.obtenerDepartamentosPorUsuario);

module.exports = router;
