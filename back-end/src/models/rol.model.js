// models/rol.model.js
module.exports = (sequelize, DataTypes) => {
    const rol = sequelize.define('rol', {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        },
        nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
        }
    }, {
        tableName: 'rol',
        timestamps: false
    });

    // 🔗 Asociación con usuario
    rol.associate = (models) => {
        rol.hasMany(models.usuario, {
        foreignKey: 'id_rol',
        as: 'usuarios'
        });
    };

    return rol;
};
