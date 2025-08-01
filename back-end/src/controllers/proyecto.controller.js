const {
  proyecto: proyectoDB,
  objetivo: objetivoDB,
  bitacora: bitacoraDB,
  proyectousuario: proyectousuarioDB,
  historial: historialDB,
  usuario: usuarioDB,
} = require('../models');
// const { Op } = require('sequelize');

const crearProyecto = async (req, res) => {
  try {
    /* nombre,
      descripcion,
      area,
      tieneObjetivos, <== obtener esto de objectivos
      objetivos,
      encargados,
      completado,
      id_departamento,
        */
    const { proyecto, usuario } = req.body;

    // Extraer usuario desde el header
    // {"id":1,"nombre":"hot","apellidos":"nuts","correo":"hotnuts@uttn.mx","rol":"Usuario","departamentos":[]}

    // console.log('req.body : proyecto', proyecto);

    if (!usuario && !usuario?.id) {
      return res.status(403).json({ mensaje: 'Usuario no autenticado.' });
    }

    // Validación de campos requeridos
    // || !usuario.id_departamento;
    if (
      !proyecto.nombre ||
      !proyecto.descripcion ||
      !proyecto.area ||
      !proyecto.idDepartamento
    ) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    // Buscar al usuario creador  y sus departamentos
    const creador = await usuarioDB.findByPk(usuario.id, {
      include: ['departamentos'],
    });
    // console.log('creador', JSON.stringify(creador));

    if (!creador || creador.departamentos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: 'Usuario o departamentos no encontrados.' });
    }

    // Verificar que el departamento pertenece al usuario
    const perteneceADepto = creador.departamentos.some(
      (dep) => dep.id === +proyecto.idDepartamento
    );
    if (!perteneceADepto) {
      return res
        .status(403)
        .json({ mensaje: 'No tienes acceso a este departamento.' });
    }

    // Crear el proyecto
    const nuevoProyecto = await proyectoDB.create({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      area: proyecto.area,
      id_departamento: proyecto.idDepartamento,
      id_creador: usuario.id,
      fecha_creacion: new Date(),
      progreso: 0,
      visible: true,
    });

    // Bitácora inicial
    await bitacoraDB.create({
      id_proyecto: nuevoProyecto.id,
      comentario: 'Inicio.',
      fecha: new Date(),
      titulo: 'Creación de proyecto',
    });

    // Asignar encargados (si los hay)
    if (Array.isArray(proyecto.encargados) && proyecto.encargados.length > 0) {
      const asignaciones = encargados.map((id_usuario_enc) => ({
        id_proyecto: nuevoProyecto.id,
        id_usuario: id_usuario_enc,
      }));
      await proyectousuarioDB.bulkCreate(asignaciones);
    }

    // Crear objetivos (si los hay)
    if (
      proyecto.objetivos &&
      proyecto.objetivos.length &&
      Array.isArray(proyecto.objetivos)
    ) {
      const listaObjetivos = proyecto.objetivos.map((obj) => ({
        descripcion: obj.texto,
        completado: obj.cumplido || false,
        id_proyecto: nuevoProyecto.id,
      }));
      await objetivoDB.bulkCreate(listaObjetivos);
    }

    // Registrar en historial
    await historialDB.create({
      id_usuario: usuario.id,
      id_proyecto: nuevoProyecto.id,
      accion: 'Creación de proyecto',
      fecha: new Date(),
    });

    res.status(201).json({
      mensaje: 'Proyecto creado exitosamente.',
      id: nuevoProyecto.id,
    });
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ mensaje: `Error interno del servidor. ${error}` });
  }
};

const obtenerProyecto = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    // Obtener usuario con sus departamentos
    const usuario = await usuarioDB.findByPk(idUsuario, {
      include: ['departamentos'],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioRol = usuario.id_rol;
    const usuarioDepartamentos = usuario.departamentos.map(dep => dep.id);

    // 🐛 Consolas útiles para depuración
    console.log('idUsuario:', idUsuario);
    console.log('usuario:', usuario.toJSON?.() || usuario);
    console.log('usuarioDepartamentos:', usuarioDepartamentos);

    let proyectos = [];

    if (usuarioRol === 1) {
      // 🟢 Admin: todos los proyectos
      proyectos = await proyectoDB.findAll();
    } else if (usuarioRol === 2) {
      // 🔵 DepLider: proyectos de los departamentos del usuario
      proyectos = await proyectoDB.findAll({
        where: {
          id_departamento: usuarioDepartamentos
        }
      });
    } else if (usuarioRol === 3) {
      // 🟠 Usuario: proyectos que creó o donde está asignado como encargado
      const proyectosComoEncargado = await proyectoDB.findAll({
        include: [{
          model: usuarioDB,
          as: 'encargados',
          where: { id: idUsuario },
          attributes: [],
          through: { attributes: [] }
        }]
      });

      const proyectosCreados = await proyectoDB.findAll({
        where: {
          id_creador: idUsuario
        }
      });

      // Unificar sin duplicar
      const mapa = new Map();
      [...proyectosCreados, ...proyectosComoEncargado].forEach(p => {
        mapa.set(p.id, p);
      });
      proyectos = Array.from(mapa.values());
    }

    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


module.exports = {
  crearProyecto,
  obtenerProyecto,
};

// UPDATE `usuario` SET `id_rol` = '1', WHERE `id` = 11;
