'user strict'

var mongoose = require('mongoose');
var app = require('./app.js');
var port = process.env.PORT || 3977;
 
/* 
 * Para eliminar el aviso de mongoose que devuelve por la consola donde hemos 
 * lanzado el npm start, tenemos que añadir la siguiente linea de código :
 */
mongoose.Promise = global.Promise;

//Conexión con mongodb
mongoose.connect('mongodb://localhost/curso_mean2', { useMongoClient: true }, function(err) {		
	if (err){
		console.log(err);		
	}else {				
		console.log('La base de datos está corriendo correctamente...');
		app.listen(port, function(){
			console.log('Servidor del API Rest de música escuchando en http://localhost:'+port);
		});
	}
});


 