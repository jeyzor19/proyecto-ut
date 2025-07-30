// models/historial.model.js
module.exports = (sequelize, DataTypes) => {
  const historial = sequelize.define('historial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    id_proyecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proyecto',
        key: 'id'
      }
    },
    accion: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'historial',
    timestamps: false
  });

  // 🔗 Asociaciones
  historial.associate = (models) => {
    historial.belongsTo(models.usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    historial.belongsTo(models.proyecto, {
      foreignKey: 'id_proyecto',
      as: 'proyecto'
    });
  };

  return historial;
};
