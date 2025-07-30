const {
  proyecto,
  objetivo,
  bitacora,
  proyectousuario,
  historial,
  usuario,
} = require('../models');
// const { Op } = require('sequelize');

const crearProyecto = async (req, res) => {
  try {
    console.log('body', req.body);
    /* const {
      nombre,
      descripcion,
      area,
      tieneObjetivos,
      objetivos,
      encargados,
      completado,
      id_departamento,
    } = req.body;

    // Extraer usuario desde el header
    // {"id":1,"nombre":"hot","apellidos":"nuts","correo":"hotnuts@uttn.mx","rol":"Usuario","departamentos":[]}
    const usuarioActual = JSON.parse(req.headers['usuario']);

    if (!usuarioActual?.id) {
      return res.status(400).json({ mensaje: 'Usuario no autenticado.' });
    }

    // Validación de campos básicos
    if (!nombre || !descripcion || !area || !id_departamento) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
    }

    // Buscar al usuario creador  y sus departamentos
    const creador = await usuario.findByPk(usuarioActual.id, {
      include: ['departamentos'],
    });

    if (!creador || creador.departamentos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: 'Usuario o departamentos no encontrados.' });
    }

    // Verificar que el departamento pertenece al usuario
    const pertenece = creador.departamentos.some(
      (dep) => dep.id === id_departamento
    );
    if (!pertenece) {
      return res
        .status(403)
        .json({ mensaje: 'No tienes acceso a este departamento.' });
    }

    // Crear el proyecto
    const nuevoProyecto = await proyecto.create({
      nombre,
      descripcion,
      area,
      id_departamento,
      id_creador: usuarioActual.id,
      fecha_creacion: new Date(),
      progreso: completado ? 100 : 0,
      visible: true,
    });

    // Bitácora inicial
    await bitacora.create({
      id_proyecto: nuevoProyecto.id,
      comentario: 'Proyecto creado.',
      fecha: new Date(),
      titulo: 'Inicio',
    });

    // Asignar encargados (si los hay)
    if (Array.isArray(encargados) && encargados.length > 0) {
      const asignaciones = encargados.map((id_usuario_enc) => ({
        id_proyecto: nuevoProyecto.id,
        id_usuario: id_usuario_enc,
      }));
      await proyectousuario.bulkCreate(asignaciones);
    }

    // Crear objetivos (si los hay)
    if (tieneObjetivos && Array.isArray(objetivos)) {
      const listaObjetivos = objetivos.map((obj) => ({
        descripcion: obj.texto,
        completado: obj.cumplido || false,
        id_proyecto: nuevoProyecto.id,
      }));
      await objetivo.bulkCreate(listaObjetivos);
    }

    // Registrar en historial
    await historial.create({
      id_usuario: usuarioActual.id,
      id_proyecto: nuevoProyecto.id,
      accion: 'Creación de proyecto',
      fecha: new Date(),
    });

    res.status(201).json({
      mensaje: 'Proyecto creado exitosamente.',
      id: nuevoProyecto.id,
    }); */

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

module.exports = {
  crearProyecto,
};

// UPDATE `usuario` SET `id_rol` = '1', WHERE `id` = 11;
