/* const path = require('path');
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
    return db.sequelize.sync(); // alter actualiza si ya existen
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
 */

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

// Función para manejar la sincronización de manera más segura
async function syncDatabase() {
  try {
    console.log(' Conectando a la base de datos...');
    await db.sequelize.authenticate();
    console.log(' Conexión establecida con la base de datos');

    // sync sin alter para evitar problemas de índices
    await db.sequelize.sync();

    console.log(' Modelos sincronizados correctamente');

    app.listen(PORT, () => {
      console.log(` Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Error al conectar o sincronizar la base de datos:', error);

    // Si el error es sobre demasiados índices, intentar recrear las tablas problemáticas
    if (error.parent && error.parent.code === 'ER_TOO_MANY_KEYS') {
      console.log(' Detectado problema de índices. Intentando solución...');
      try {
        // Recrear las tablas más problemáticas
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.sequelize.query('DROP TABLE IF EXISTS usuariodepartamento');
        await db.sequelize.query('DROP TABLE IF EXISTS proyectousuario');
        await db.sequelize.query('DROP TABLE IF EXISTS departamento');
        await db.sequelize.query('DROP TABLE IF EXISTS usuario');
        await db.sequelize.query('DROP TABLE IF EXISTS proyecto');
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Recrear con sync normal
        await db.sequelize.sync();
        console.log(' Tablas recreadas exitosamente');

        app.listen(PORT, () => {
          console.log(` Servidor escuchando en http://localhost:${PORT}`);
        });
      } catch (recreateError) {
        console.error(' Error al recrear tablas:', recreateError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

// Ejecutar la sincronización
syncDatabase();
