const express = require('express');
const { json } = require('express');
const morgan = require('morgan');
//importando rutas
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const applicationsRoutes = require('./routes/applications');

//inicializacion
const app = express();

//middlewares
app.use(morgan('dev'));
app.use(json());
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//routes
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/applications', applicationsRoutes);

module.exports = app;