'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Artist = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  var albumId = req.params.id;
  Album.findById(albumId).populate({path : 'artist'}).exec((err, album) => {
    if (err){
      res.status(500).send({message:'Error en la petición'});
    }else {
      if (!album){
        res.status(404).send({message:'No se ha encontrado el album'});
      }else{
        res.status(200).send({album:album});
      }
    }
  });
}

function getAlbums(req, res){
  var artistId = req.params.artist;
  if (!artistId) {
    //Sacar todos los albums de la bbdd
    var find = Album.find({}).sort('title');
  }else {
    //Sacar todos los albums de un artista de la bbdd
    var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path:'artist'}).exec((err, albums) => {
    if (err){
      res.status(500).send({message:'Error en la petición'});
    }else {
      if (!albums){
        res.status(404).send({message:'No se han encontrado albums'});
      }else{
        res.status(200).send({albums:albums});
      }
    }
  });
}

function saveAlbum(req, res){
  var album = new Album();
  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.artist = params.artist;
  album.image = params.image;
  //Guardar el album
  album.save((err, albumStored) => {
    if (err){
      res.status(500).send({message:'Error al guardar el album'});
    }else {
      if (!albumStored){
        res.status(404).send({message:'No se ha registrado el album'});
      }else{
        res.status(200).send({album:albumStored});
      }
    }
  });
}


/*
*	UPDATE ALBUM
*/
function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;
	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err){
			res.status(500).send({message:'Error al actualizar el album'});
		}else {
			if (!albumUpdated){
				res.status(404).send({message:'No se ha podido actualizar el album'});
			}else {
				res.status(200).send({albumUpdated});
			}
		}
	});
}

/*
*	DELETE ALBUM
*/
function deleteAlbum(req, res){
	var albumId = req.params.id;
	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if (err){
			res.status(500).send({message:'Error al borrar el album'});
		}else {
			if (!albumRemoved){
				res.status(404).send({message:'No se ha podido borrar el album'});
			}else {
        //Borramos todas las canciones del album
        Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
          if (err){
            res.status(500).send({message:'Error al borrar la canción'});
          }else {
            if (!songRemoved){
              res.status(404).send({message:'No se ha podido borrar la canción'});
            }else {
              res.status(200).send({album:albumRemoved});
            }
          }
        });
			}
		}
	});
}


/*
*	UPLOAD IMAGE
*/
function uploadImage(req, res){

	var albumId = req.params.id;
	var file_name = req.params.file_name;

	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif' || file_ext === 'jpeg'){

			Album.findByIdAndUpdate(albumId, { image:file_name }, (err, albumUpdated) => {
				if (err){
					res.status(500).send({message:'Error al actualizar el album'});
				}else {
					if (!albumUpdated){
						res.status(404).send({message:'No se ha podido actualizar el album'});
					}else {
						res.status(200).send({albumUpdated});
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
	var pathFile = './uploads/albums/'+imageFile;
	fs.exists(pathFile, function(exits){
		if (exits){
			res.sendFile(path.resolve(pathFile));
		}else {
			res.status(200).send({ message : 'No existe la imagen...' });
		}
	});
}



module.exports = {
  getAlbum,
  getAlbums,
  saveAlbum,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
