// models/departamento.model.js
module.exports = (sequelize, DataTypes) => {
  const departamento = sequelize.define('departamento', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'departamento',
    timestamps: false
  });

  // 🔗 Asociaciones
  departamento.associate = (models) => {
    departamento.hasMany(models.proyecto, {
      foreignKey: 'id_departamento',
      as: 'proyectos'
    });

    departamento.belongsToMany(models.usuario, {
      through: 'usuariodepartamento',
      foreignKey: 'id_departamento',
      otherKey: 'id_usuario',
      as: 'usuarios'
    });
  };

  return departamento;
};
