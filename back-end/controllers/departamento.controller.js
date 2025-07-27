const { departamento } = require('../models');

const obtenerDepartamentos = async (req, res) => {
  try {
    const departamentos = await departamento.findAll();
    res.json(departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const { usuario } = require('../models');

const obtenerDepartamentosPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioBD = await usuario.findByPk(id, {
      include: ['departamentos']
    });

    if (!usuarioBD) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuarioBD.departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos por usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


module.exports = {
  obtenerDepartamentos,
  obtenerDepartamentosPorUsuario
};
