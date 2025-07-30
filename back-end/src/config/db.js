// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mi_basededatos', 'root', 'contasena', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
