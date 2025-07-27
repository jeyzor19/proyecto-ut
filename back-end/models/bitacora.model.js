// models/bitacora.model.js
module.exports = (sequelize, DataTypes) => {
  const bitacora = sequelize.define('bitacora', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_proyecto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proyecto',  // minúscula, coincide con nombre de tabla
        key: 'id'
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    tableName: 'bitacora',
    timestamps: false
  });

  // 🔗 Asociación
  bitacora.associate = (models) => {
    bitacora.belongsTo(models.proyecto, {
      foreignKey: 'id_proyecto',
      as: 'proyecto'
    });
  };

  return bitacora;
};
