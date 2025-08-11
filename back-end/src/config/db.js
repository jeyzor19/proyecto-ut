// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('datapi', 'root', 'admin123', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
