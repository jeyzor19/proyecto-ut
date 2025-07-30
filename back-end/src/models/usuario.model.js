// models/usuario.model.js
module.exports = (sequelize, DataTypes) => {
    const usuario = sequelize.define('usuario', {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        },
        nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
        },
        apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
        },
        correo: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true
        },
        contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
        },
        id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false
        }
    }, {
        tableName: 'usuario',
        timestamps: false
    });

  // 🔗 Definir asociaciones
    usuario.associate = (models) => {
        usuario.belongsTo(models.rol, {
        foreignKey: 'id_rol',
        as: 'rol'
        });

        usuario.belongsToMany(models.departamento, {
        through: 'usuariodepartamento',
        foreignKey: 'id_usuario',
        otherKey: 'id_departamento',
        as: 'departamentos'
        });

        usuario.belongsToMany(models.proyecto, {
        through: 'proyectousuario',
        foreignKey: 'id_usuario',
        otherKey: 'id_proyecto',
        as: 'proyectos'
        });

        usuario.hasMany(models.proyecto, {
        foreignKey: 'id_creador',
        as: 'proyectos_creados'
        });

        usuario.hasMany(models.historial, {
        foreignKey: 'id_usuario',
        as: 'historial'
        });
    };

    return usuario;
};
