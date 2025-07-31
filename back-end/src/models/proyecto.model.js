// models/proyecto.model.js
module.exports = (sequelize, DataTypes) => {
  const proyecto = sequelize.define(
    'proyecto',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      progreso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      area: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      id_departamento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'departamento', // minúscula
          key: 'id',
        },
      },
      id_creador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario', // minúscula
          key: 'id',
        },
      },
    },
    {
      tableName: 'proyecto',
      timestamps: false,
    }
  );

  // Asociaciones
  proyecto.associate = (models) => {
    proyecto.belongsTo(models.departamento, {
      foreignKey: 'id_departamento',
      as: 'departamento',
    });

    proyecto.belongsTo(models.usuario, {
      foreignKey: 'id_creador',
      as: 'creador',
    });

    proyecto.belongsToMany(models.usuario, {
      through: 'proyectousuario',
      foreignKey: 'id_proyecto',
      otherKey: 'id_usuario',
      as: 'encargados',
    });

    proyecto.hasMany(models.objetivo, {
      foreignKey: 'id_proyecto',
      as: 'objetivos',
    });

    proyecto.hasMany(models.bitacora, {
      foreignKey: 'id_proyecto',
      as: 'bitacoras',
    });

    proyecto.hasMany(models.historial, {
      foreignKey: 'id_proyecto',
      as: 'historial',
    });
  };

  return proyecto;
};
