const {
  usuario: usuarioDB,
  departamento: departamentoDB,
} = require('../models');

const obtenerDepartamentos = async (req, res) => {
  try {
    const departamentos = await departamentoDB.findAll();
    // console.log('departamentos', departamentos);
    // res.status(200).send({ departamentos });
    res.json(departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const obtenerDepartamentosPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioDB.findByPk(id, {
      include: ['departamentos'],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario.departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos por usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerDepartamentos,
  obtenerDepartamentosPorUsuario,
};
