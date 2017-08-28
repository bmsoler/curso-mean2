'user strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routers = require('./routers/user');
var artist_routers = require('./routers/artist');
var album_routers = require('./routers/album');
var song_routers = require('./routers/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configurar cabeceras
app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// rutas base
app.use('/api', user_routers);
app.use('/api', artist_routers);
app.use('/api', album_routers);
app.use('/api', song_routers);

module.exports = app;
