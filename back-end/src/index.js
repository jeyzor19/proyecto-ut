const path = require('path');
const db = require('./models');
const router = require('./routes/router.routes');
const express = require('express');

const app = express();
const PORT = 3000;

// Middleware para aceptar JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Routers - Paths
app.use(router);

// Probar conexión y sincronización
db.sequelize
  .authenticate()
  .then(() => {
    console.log(' Conexión establecida con la base de datos');
    return db.sequelize.sync({ alter: true }); // alter actualiza si ya existen
  })
  .then(() => {
    console.log(' Modelos sincronizados correctamente');
    app.listen(PORT, () => {
      console.log(` Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' Error al conectar o sincronizar la base de datos:', error);
  });
