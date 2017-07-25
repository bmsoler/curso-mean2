'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var mongoose = require('mongoose');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

/*
*
*/
function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

/*
*	SAVE USER
*/
function saveUser(req, res){
	var params = req.body;

	var user = new User();
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if (params.password){
		//Encriptar contraseña
		bcrypt.hash(params.password, null, null, function(err, has){
				user.password = has;
				if (user.name && user.surname && user.email){
					//Guardar el usuario
					user.save((err, userStored) => {
						if (err){
							res.status(500).send({message:'Error al guardar el usuario'});
						}else {
							if (!userStored){
								res.status(404).send({message:'No se ha registrado el usuario'});
							}else{
								res.status(200).send({user:userStored});
							}
						}
					});
				}else {
					res.status(200).send({message:'Rellena todos los datos'});
				}
			}
		);
	}else {
		res.status(200).send({message:'Introduce la contraseña'});
	}
}

/*
*	LOGIN
*/
function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err){
			res.status(500).send({message:'Error en la petición'});
		}else {
			if (!user){
				res.status(404).send({message:'El usuario no existe'});
			}else {
				//Comprobar la contraseña
				bcrypt.compare(password, user.password, function (err, check){
					if (check){
						//devolver los datos del usuario
						if (params.gethash){
							// devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else {
							res.status(200).send({user});
						}
					}else {
						res.status(404).send({message:'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});
}

/*
*	UPDATE USER
*/
function updateUser(req, res){

	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err){
			res.status(500).send({message:'Error al actualizar el usuario'});
		}else {
			if (!userUpdated){
				res.status(404).send({message:'No se ha podido actualizar el usuario'});
			}else {
				res.status(200).send({userUpdated});
			}
		}
	});
}


/*
*	UPLOAD IMAGE
*/
function uploadImage(req, res){

	var userId = req.params.id;
	var file_name = req.params.file_name;

	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif'){

			User.findByIdAndUpdate(userId, { image:file_name }, (err, userUpdated) => {
				if (err){
					res.status(500).send({message:'Error al actualizar el usuario'});
				}else {
					if (!userUpdated){
						res.status(404).send({message:'No se ha podido actualizar el usuario'});
					}else {
						res.status(200).send({image:file_name, user:userUpdated});
					}
				}
			});

		}else{
			res.status(200).send({ message : 'Extensión del archivo no válida'});
		}

	}else {
		res.status(200).send({ message : 'No se ha subido ninguna imagen' });
	}
}



/*
*	GET IMAGE
*/
function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/users/'+imageFile;
	fs.exists(pathFile, function(exits){
		if (exits){
			res.sendFile(path.resolve(pathFile));
		}else {
			res.status(200).send({ message : 'No existe la imagen...' });
		}
	});
}


module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};
