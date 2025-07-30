// models/usuario_departamento.model.js
module.exports = (sequelize, DataTypes) => {
  const UsuarioDepartamento = sequelize.define('usuariodepartamento', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'usuario',
        key: 'id'
      }
    },
    id_departamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'departamento',
        key: 'id'
      }
    }
  }, {
    tableName: 'usuariodepartamento',
    timestamps: false
  });

  return UsuarioDepartamento;
};
