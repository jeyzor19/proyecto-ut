const { objetivo: objetivoDB } = require('../models');

const actualizarObjetivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completado } = req.body;

    const obj = await objetivoDB.findByPk(id);  // ⬅ renombrado aquí
    if (!obj) return res.status(404).json({ mensaje: 'Objetivo no encontrado' });

    obj.completado = completado;
    await obj.save();  // ⬅ ya no da conflicto de nombres

    res.json({ mensaje: 'Objetivo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar objetivo:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  actualizarObjetivo
};
