const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000; 

// Middleware para aceptar JSON
app.use(express.json());
// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importamos los modelos y Sequelize
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const rolRoutes = require('./routes/rol.routes');
const departamentoRoutes = require('./routes/departamento.routes');
const proyectoRoutes = require('./routes/proyecto.routes');
// Aquí luego puedes agregar más rutas, como:
// const proyectoRoutes = require('./routes/proyecto.routes');

app.use('/api', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/departamentos', require('./routes/departamento.routes'));
app.use('/api/proyectos', proyectoRoutes);

// Usar rutas

// app.use('/api/proyectos', proyectoRoutes); // cuando las tengas listas

// Probar conexión y sincronización
db.sequelize.authenticate()
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
