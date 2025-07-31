const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('../config/db');

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      dbConfig,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Ejecutar asociaciones definidas dentro de los modelos
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = dbConfig;
db.Sequelize = Sequelize;

module.exports = db;
