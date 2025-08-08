const express = require('express');
const router = express.Router();
const { actualizarObjetivo } = require('../controllers/objetivo.controller');

// Solo la ruta relativa:
router.put('/:id', actualizarObjetivo);

module.exports = router;
