// models/proyecto_usuario.model.js
module.exports = (sequelize, DataTypes) => {
  const proyectousuario = sequelize.define('proyectousuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'usuario',  // tabla real en minúscula
        key: 'id'
      }
    },
    id_proyecto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'proyecto',  // tabla real en minúscula
        key: 'id'
      }
    }
  }, {
    tableName: 'proyectousuario',
    timestamps: false
  });

  return proyectousuario;
};
