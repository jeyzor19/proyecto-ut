// models/objetivo.model.js
module.exports = (sequelize, DataTypes) => {
  const objetivo = sequelize.define('objetivo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    completado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    id_proyecto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proyecto',  // importante: en minúscula
        key: 'id'
      }
    }
  }, {
    tableName: 'objetivo',
    timestamps: false
  });

  // 🔗 Asociación con proyecto
  objetivo.associate = (models) => {
    objetivo.belongsTo(models.proyecto, {
      foreignKey: 'id_proyecto',
      as: 'proyecto'
    });
  };

  return objetivo;
};
