const {
  proyecto: proyectoDB,
  objetivo: objetivoDB,
  bitacora: bitacoraDB,
  departamento: departamentoDB,
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
      const asignaciones = proyecto.encargados.map((id_usuario_enc) => ({
        id_proyecto: nuevoProyecto.id,
        id_usuario: +id_usuario_enc,
      }));
      await proyectousuarioDB.bulkCreate(asignaciones);
    }

    // Crear objetivos (si los hay)
    if (
      proyecto.objetivos &&
      proyecto.objetivos.length &&
      Array.isArray(proyecto.objetivos)
    ) {
      // console.log('proyecto.objetivos', proyecto.objetivos);
      const listaObjetivos = proyecto.objetivos.map((obj) => ({
        descripcion: obj,
        completado: false,
        id_proyecto: nuevoProyecto.id,
      }));
      // console.log('listaObjetivos', listaObjetivos);
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

const actualizarProyecto = async (req, res) => {
  try {
    const { proyecto, usuario } = req.body;
    const { proyectoId: id } = req.params; // ID del proyecto a actualizar

    // Validar usuario autenticado
    if (!usuario || !usuario?.id) {
      return res.status(403).json({ mensaje: 'Usuario no autenticado.' });
    }

    // Validar que se proporcione el ID del proyecto
    if (!id) {
      return res.status(400).json({ mensaje: 'ID del proyecto es requerido.' });
    }

    // Buscar el proyecto existente
    const proyectoExistente = await proyectoDB.findByPk(id, {
      include: [
        'objetivos',
        'encargados',
        {
          model: usuarioDB,
          as: 'creador',
          include: ['departamentos'],
        },
      ],
    });

    if (!proyectoExistente) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });
    }

    // Buscar al usuario que actualiza y sus departamentos
    const usuarioActualizador = await usuarioDB.findByPk(usuario.id, {
      include: ['departamentos'],
    });

    if (
      !usuarioActualizador ||
      usuarioActualizador.departamentos.length === 0
    ) {
      return res
        .status(404)
        .json({ mensaje: 'Usuario o departamentos no encontrados.' });
    }

    // Verificar permisos: debe ser el creador o tener acceso al departamento
    const perteneceADepto = usuarioActualizador.departamentos.some(
      (dep) => dep.id === proyectoExistente.id_departamento
    );

    const esCreador = proyectoExistente.id_creador === usuario.id;

    if (!esCreador && !perteneceADepto) {
      return res
        .status(403)
        .json({ mensaje: 'No tienes permisos para actualizar este proyecto.' });
    }

    // Objeto para almacenar los cambios
    const cambiosProyecto = {};
    const cambiosRealizados = [];

    // Validar y preparar campos a actualizar
    if (proyecto.nombre && proyecto.nombre !== proyectoExistente.nombre) {
      cambiosProyecto.nombre = proyecto.nombre;
      cambiosRealizados.push(
        `Nombre: "${proyectoExistente.nombre}" → "${proyecto.nombre}"`
      );
    }

    if (
      proyecto.descripcion &&
      proyecto.descripcion !== proyectoExistente.descripcion
    ) {
      cambiosProyecto.descripcion = proyecto.descripcion;
      cambiosRealizados.push(`Descripción actualizada`);
    }

    if (proyecto.area && proyecto.area !== proyectoExistente.area) {
      cambiosProyecto.area = proyecto.area;
      cambiosRealizados.push(
        `Área: "${proyectoExistente.area}" → "${proyecto.area}"`
      );
    }

    if (
      proyecto.progreso !== undefined &&
      proyecto.progreso !== proyectoExistente.progreso
    ) {
      cambiosProyecto.progreso = proyecto.progreso;
      cambiosRealizados.push(
        `Progreso: ${proyectoExistente.progreso}% → ${proyecto.progreso}%`
      );
    }

    if (
      proyecto.completado !== undefined &&
      proyecto.completado !== proyectoExistente.completado
    ) {
      cambiosProyecto.completado = proyecto.completado;
      cambiosRealizados.push(
        `Estado: ${
          proyectoExistente.completado ? 'Completado' : 'En progreso'
        } → ${proyecto.completado ? 'Completado' : 'En progreso'}`
      );
    }

    // Cambio de departamento (validar permisos)
    if (
      proyecto.idDepartamento &&
      proyecto.idDepartamento !== proyectoExistente.id_departamento
    ) {
      const perteneceANuevoDepto = usuarioActualizador.departamentos.some(
        (dep) => dep.id === +proyecto.idDepartamento
      );

      if (!perteneceANuevoDepto) {
        return res
          .status(403)
          .json({ mensaje: 'No tienes acceso al departamento especificado.' });
      }

      cambiosProyecto.id_departamento = proyecto.idDepartamento;
      cambiosRealizados.push(`Departamento actualizado`);
    }

    // Actualizar el proyecto si hay cambios
    if (Object.keys(cambiosProyecto).length > 0) {
      await proyectoDB.update(cambiosProyecto, {
        where: { id: id },
      });
    }

    // Actualizar encargados si se proporcionan
    if (Array.isArray(proyecto.encargados)) {
      // Eliminar asignaciones actuales
      await proyectousuarioDB.destroy({
        where: { id_proyecto: id },
      });

      // Crear nuevas asignaciones
      if (proyecto.encargados.length > 0) {
        const nuevasAsignaciones = proyecto.encargados.map(
          (id_usuario_enc) => ({
            id_proyecto: id,
            id_usuario: +id_usuario_enc,
          })
        );
        await proyectousuarioDB.bulkCreate(nuevasAsignaciones);
        cambiosRealizados.push('Encargados actualizados');
      }
    }

    // Actualizar objetivos si se proporcionan
    if (Array.isArray(proyecto.objetivos)) {
      // Eliminar objetivos actuales
      await objetivoDB.destroy({
        where: { id_proyecto: id },
      });

      // Crear nuevos objetivos
      if (proyecto.objetivos.length > 0) {
        const nuevosObjetivos = proyecto.objetivos.map((obj) => {
          // Permitir tanto strings como objetos con descripcion y completado
          if (typeof obj === 'string') {
            return {
              descripcion: obj,
              completado: false,
              id_proyecto: id,
            };
          } else {
            return {
              descripcion: obj.descripcion || obj,
              completado: obj.completado || false,
              id_proyecto: id,
            };
          }
        });
        await objetivoDB.bulkCreate(nuevosObjetivos);
        cambiosRealizados.push('Objetivos actualizados');
      }
    }

    // Crear entrada en bitácora si hubo cambios
    if (cambiosRealizados.length > 0) {
      await bitacoraDB.create({
        id_proyecto: id,
        comentario: `Cambios realizados: ${cambiosRealizados.join(', ')}`,
        fecha: new Date(),
        titulo: 'Actualización de proyecto',
      });

      // Registrar en historial
      await historialDB.create({
        id_usuario: usuario.id,
        id_proyecto: id,
        accion: 'Actualización de proyecto',
        fecha: new Date(),
      });
    }

    res.status(200).json({
      mensaje:
        cambiosRealizados.length > 0
          ? 'Proyecto actualizado exitosamente.'
          : 'No se realizaron cambios en el proyecto.',
      cambios: cambiosRealizados,
      id: id,
    });
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ mensaje: `Error interno del servidor. ${error}` });
  }
};

const obtenerProyectoPorId = async (req, res) => {
  try {
    const { usuarioId, proyectoId } = req.params;
    console.log('usuarioId', usuarioId);
    console.log('proyectoId', proyectoId);

    const proyecto = await proyectoDB.findByPk(proyectoId, {
      include: [
        {
          model: objetivoDB,
          as: 'objetivos', // asegúrate que el alias coincida con tu modelo
          attributes: ['id', 'descripcion', 'completado'],
        },
        {
          model: usuarioDB,
          as: 'encargados', // a través de la tabla intermedia proyectousuario
          attributes: ['id', 'nombre', 'apellidos', 'correo'],
          through: { attributes: [] }, // excluir campos de la tabla intermedia
        },
        {
          model: usuarioDB,
          as: 'creador', // el usuario que creó el proyecto
          attributes: ['id', 'nombre', 'apellidos', 'correo'],
        },
        {
          model: departamentoDB,
          as: 'departamento',
          attributes: ['id', 'nombre'],
        },
      ],
    });

    console.log('Proyecto: \n', proyecto);
    res.status(200).send(proyecto);
  } catch (error) {
    console.error('Error al editar el proyecto:', error);
    res.status(500).json({ mensaje: `Error interno del servidor. ${error}` });
  }
};

const obtenerProyecto = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await usuarioDB.findByPk(idUsuario, {
      include: ['departamentos'],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioRol = usuario.id_rol;
    const usuarioDepartamentos = usuario.departamentos.map((dep) => dep.id);

    // 🐛 Consolas útiles para depuración

    let proyectos = [];

    const includeObjetivosYEncargados = [
      {
        model: objetivoDB,
        as: 'objetivos',
        attributes: ['id', 'descripcion', 'completado'],
      },
      {
        model: usuarioDB,
        as: 'encargados',
        attributes: ['id', 'nombre', 'apellidos'],
        through: { attributes: [] },
      },
    ];

    if (usuarioRol === 1) {
      // 🟢 Admin: todos los proyectos
      proyectos = await proyectoDB.findAll({
        where: { visible: true },
        include: includeObjetivosYEncargados,
      });
    } else if (usuarioRol === 2) {
      // 🔵 DepLider: proyectos de los departamentos del usuario
      proyectos = await proyectoDB.findAll({
        where: {
          id_departamento: usuarioDepartamentos,
          visible: true,
        },
        include: includeObjetivosYEncargados,
      });
    } else if (usuarioRol === 3) {
      // 🟠 Usuario: proyectos que creó o donde está asignado como encargado

      const proyectosComoEncargado = await proyectoDB.findAll({
        where: { visible: true },
        include: [
          ...includeObjetivosYEncargados,
          {
            model: usuarioDB,
            as: 'encargados',
            attributes: ['id', 'nombre', 'apellidos'], // ✅ Ahora se incluyen todos
            through: { attributes: [] },
          },
        ],
      });

      // Filtrar solo aquellos donde el usuario está asignado
      const filtrados = proyectosComoEncargado.filter((p) =>
        p.encargados.some((e) => e.id === +idUsuario)
      );

      const proyectosCreados = await proyectoDB.findAll({
        where: {
          id_creador: idUsuario,
          visible: true,
        },
        include: includeObjetivos,
        include: includeObjetivosYEncargados,
      });

      // Unificar sin duplicados
      const mapa = new Map();
      [...proyectosCreados, ...filtrados].forEach((p) => {
        mapa.set(p.id, p);
      });
      proyectos = Array.from(mapa.values());
    }
    // 🔁 Calcular el progreso basado en objetivos completados
    proyectos = proyectos.map((p) => {
      const objetivos = p.objetivos || [];
      const total = objetivos.length;
      const completados = objetivos.filter((obj) => obj.completado).length;
      const progreso =
        total === 0 ? 0 : Math.round((completados / total) * 100);

      // 🧠 Agrega el progreso al objeto JSON
      const json = p.toJSON();
      json.progreso = progreso;

      return json;
    });

    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const marcarComoCompletado = async (req, res) => {
  try {
    const { id } = req.params;

    const proyecto = await proyectoDB.findByPk(id, {
      include: ['objetivos'],
    });

    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    const objetivos = proyecto.objetivos || [];
    const total = objetivos.length;
    const completados = objetivos.filter((o) => o.completado).length;

    if (total === 0) {
      return res
        .status(400)
        .json({ mensaje: 'El proyecto no tiene objetivos.' });
    }

    if (completados < total) {
      return res.status(400).json({ mensaje: 'Aún hay objetivos pendientes.' });
    }

    // ✅ Todos los objetivos están completos, actualiza progreso a 100
    proyecto.progreso = 100;
    await proyecto.save();

    return res.status(200).json({ mensaje: 'Proyecto completado con éxito.' });
  } catch (error) {
    console.error('Error al completar proyecto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

const eliminarProyecto = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await proyectoDB.update(
      { visible: false },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });
    }

    res.json({ mensaje: 'Proyecto eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
};

const obtenerProyectosEliminados = async (req, res) => {
  try {
    const proyectos = await proyectoDB.findAll({
      where: { visible: false },
      include: [
        {
          model: objetivoDB,
          as: 'objetivos',
          attributes: ['id', 'descripcion', 'completado'],
        },
      ],
    });

    res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos eliminados:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};
const reactivarProyecto = async (req, res) => {
  try {
    const id = req.params.id;

    const [updated] = await proyectoDB.update(
      { visible: true },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado.' });
    }

    res.json({ mensaje: 'Proyecto reactivado correctamente.' });
  } catch (error) {
    console.error('Error al reactivar proyecto:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
};

module.exports = {
  crearProyecto,
  obtenerProyecto,
  obtenerProyectoPorId,
  marcarComoCompletado,
  eliminarProyecto,
  obtenerProyectosEliminados,
  actualizarProyecto,
  reactivarProyecto,
};

// UPDATE `usuario` SET `id_rol` = '1', WHERE `id` = 11;
