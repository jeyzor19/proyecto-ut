const express = require('express');
const router = express.Router();
const { registrarUsuario, obtenerUsuarios, actualizarRol, asignarDepartamentos, obtenerDepartamentosUsuario, loginUsuario, eliminarUsuario, obtenerUsuariosPorDepartamento} = require('../controllers/usuario.controller');

// Ruta POST para registrar usuario
router.post('/registro', registrarUsuario);
router.get('/', obtenerUsuarios);
router.put('/:id/rol', actualizarRol);
router.put('/:id/departamentos', asignarDepartamentos);
router.get('/:id/departamentos', obtenerDepartamentosUsuario);
router.post('/login', loginUsuario);
router.delete('/:id', eliminarUsuario);
router.get('/por-departamento/:id_departamento', obtenerUsuariosPorDepartamento);



module.exports = router;
