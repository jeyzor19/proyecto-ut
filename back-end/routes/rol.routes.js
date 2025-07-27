const express = require('express');
const router = express.Router();
const { obtenerRoles } = require('../controllers/rol.controller');

router.get('/', obtenerRoles); // GET /api/roles

module.exports = router;
