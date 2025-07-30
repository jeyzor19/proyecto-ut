const { rol } = require('../models');

const obtenerRoles = async (req, res) => {
  try {
    const roles = await rol.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener roles.' });
  }
};

module.exports = {
  obtenerRoles
};
