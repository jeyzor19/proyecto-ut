const bcrypt = require('bcrypt');
const {
  usuario,
  rol,
  departamento,
  usuariodepartamento,
} = require('../models');

// Controlador para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellidos, correo, contrasena } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !apellidos || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    // Validar dominio del correo
    const dominioPermitido = '@uttn.mx';
    if (!correo.endsWith(dominioPermitido)) {
      return res.status(400).json({
        mensaje: 'Correo no autorizado. Debe terminar en ' + dominioPermitido,
      });
    }

    // Verificar si ya existe un usuario con ese correo
    const existente = await usuario.findOne({ where: { correo } });
    if (existente) {
      return res
        .status(409)
        .json({ mensaje: 'Ya existe un usuario con ese correo.' });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear el usuario con rol por defecto (ej. id_rol = 3 -> "usuario") y departamento ficticio
    const nuevoUsuario = await usuario.create({
      nombre,
      apellidos,
      correo,
      contrasena: hash,
      id_rol: 3, // Cambia este valor si tu ID para rol "usuario" es diferente
    });

    // Asignar a departamento ficticio (ej. id = 1 -> "sin_dep")
    await usuariodepartamento.create({
      id_usuario: nuevoUsuario.id,
      id_departamento: 18, // Cambia este ID si tu depto ficticio tiene otro ID
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuario.findAll({
      include: [
        { model: rol, as: 'rol' },
        {
          model: departamento,
          as: 'departamentos',
          through: { attributes: [] }, // evita incluir campos del join
        },
      ],
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error interno al obtener usuarios.' });
  }
};

const actualizarRol = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const { id_rol } = req.body;

    if (!id_rol) {
      return res.status(400).json({ mensaje: 'ID de rol no proporcionado.' });
    }

    const user = await usuario.findByPk(idUsuario);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    user.id_rol = id_rol;
    await user.save();

    res.json({ mensaje: 'Rol actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el rol.' });
  }
};

const asignarDepartamentos = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const { departamentos } = req.body;

    if (!Array.isArray(departamentos)) {
      return res
        .status(400)
        .json({ mensaje: 'Se requiere un arreglo de IDs de departamentos.' });
    }

    // Verifica que el usuario existe
    const user = await usuario.findByPk(idUsuario);
    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Elimina asignaciones anteriores
    await usuariodepartamento.destroy({ where: { id_usuario: idUsuario } });

    // Asigna los nuevos departamentos
    const nuevasAsignaciones = departamentos.map((idDep) => ({
      id_usuario: idUsuario,
      id_departamento: idDep,
    }));

    await usuariodepartamento.bulkCreate(nuevasAsignaciones);

    res.json({ mensaje: 'Departamentos asignados correctamente.' });
  } catch (error) {
    console.error('Error al asignar departamentos:', error);
    res.status(500).json({ mensaje: 'Error al asignar departamentos.' });
  }
};

const obtenerDepartamentosUsuario = async (req, res) => {
  const idUsuario = req.params.id;

  try {
    const user = await usuario.findByPk(idUsuario, {
      include: {
        model: departamento,
        as: 'departamentos',
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(user.departamentos);
  } catch (error) {
    console.error('Error al obtener departamentos del usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ mensaje: 'Correo y contraseña son obligatorios.' });
  }

  try {
    // Buscar al usuario por correo
    const user = await usuario.findOne({
      where: { correo },
      include: [
        { model: rol, as: 'rol' },
        {
          model: departamento,
          as: 'departamentos',
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ mensaje: 'Usuario o contraseña incorrectos.' });
    }

    // Verificar contraseña
    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido) {
      return res
        .status(401)
        .json({ mensaje: 'Usuario o contraseña incorrectos.' });
    }

    // Devolver datos necesarios
    res.json({
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      correo: user.correo,
      rol: user.rol?.nombre || 'Sin rol',
      departamentos: user.departamentos.map((dep) => ({
        id: dep.id,
        nombre: dep.nombre,
      })),
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

const eliminarUsuario = async (req, res) => {
  const id = req.params.id;

  try {
    // Elimina primero las asociaciones con departamentos
    await usuariodepartamento.destroy({ where: { id_usuario: id } });

    // Luego elimina el usuario
    const resultado = await usuario.destroy({ where: { id } });

    if (resultado === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario.' });
  }
};

const obtenerUsuariosPorDepartamento = async (req, res) => {
  const { idDepartamento } = req.params;

  try {
    const usuarios = await usuario.findAll({
      include: {
        model: departamento,
        as: 'departamentos',
        where: { id: idDepartamento },
        attributes: [],
        through: { attributes: [] },
      },
      attributes: ['id', 'nombre', 'apellidos'],
    });

    res.status(200).json({ encargados: usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios del departamento:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios.' });
  }
};

module.exports = {
  registrarUsuario,
  obtenerUsuarios,
  actualizarRol,
  asignarDepartamentos,
  obtenerDepartamentosUsuario,
  loginUsuario,
  eliminarUsuario,
  obtenerUsuariosPorDepartamento,
};
