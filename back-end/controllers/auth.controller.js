const bcrypt = require('bcrypt');
const { usuario, rol, departamento } = require('../models');

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const user = await usuario.findOne({
      where: { correo },
      include: [
        { model: rol, as: 'rol', attributes: ['nombre'] },
        { model: departamento, as: 'departamentos', attributes: ['id', 'nombre'], through: { attributes: [] } }
      ]
    });

    if (!user) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (correo).' });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña).' });
    }

    res.json({
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      correo: user.correo,
      rol: user.rol.nombre,
      departamentos: user.departamentos
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { login };
