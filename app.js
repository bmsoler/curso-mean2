'user strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routers = require('./routers/user');
var artist_routers = require('./routers/artist');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras

// rutas base
app.use('/api', user_routers);
app.use('/api', artist_routers);

module.exports = app;
