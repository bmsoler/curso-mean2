'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Artist = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
  var songId = req.params.id;
  Song.findById(songId).populate({path : 'album'}).exec((err, song) => {
    if (err){
      res.status(500).send({message:'Error en la petición'});
    }else {
      if (!song){
        res.status(404).send({message:'No se ha encontrado la canción'});
      }else{
        res.status(200).send({song:song});
      }
    }
  });
}

function saveSong(req, res){
  var song = new Song();
  var params = req.body;
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = null;
  song.album = params.album;
  //Guardar la canción
  song.save((err, songStored) => {
    if (err){
      console.log(err);
      res.status(500).send({message:'Error al guardar la canción'});
    }else {
      if (!songStored){
        res.status(404).send({message:'No se ha registrado la canción'});
      }else{
        res.status(200).send({song:songStored});
      }
    }
  });
}

function getSongs(req, res){
  var albumId = req.params.album;
  if (!albumId) {
    //Sacar todos los albums de la bbdd
    var find = Song.find({}).sort('number');
  }else {
    //Sacar todos los albums de un artista de la bbdd
    var find = Song.find({album: albumId}).sort('number');
  }
  find.populate({
      path:'album',
      populate: {
        path:'artist',
        model:'Artist'
      }
    }).exec((err, songs) => {
      if (err){
        res.status(500).send({message:'Error en la petición'});
      }else {
        if (!songs){
          res.status(404).send({message:'No se han encontrado canciones'});
        }else{
          res.status(200).send({songs:songs});
        }
      }
  });
}

/*
*	UPDATE SONG
*/
function updateSong(req, res){
	var songId = req.params.id;
	var update = req.body;
	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if (err){
			res.status(500).send({message:'Error al actualizar el album'});
		}else {
			if (!songUpdated){
				res.status(404).send({message:'No se ha podido actualizar la canción'});
			}else {
				res.status(200).send({songUpdated});
			}
		}
	});
}

function deleteSong(req, res){
  var songId = req.params.id;
  Song.findByIdAndRemove(songId, (err, songRemoved) => {
    if (err){
      res.status(500).send({message:'Error al actualizar el album'});
    }else {
      if (!songRemoved){
        res.status(404).send({message:'No se ha podido actualizar la canción'});
      }else {
        res.status(200).send({song:songRemoved});
      }
    }
  });
}


/*
*	UPLOAD FILE
*/
function uploadFile(req, res){

	var songId = req.params.id;
	var file_name = 'No subido...';

	if (req.files){
		var file_path = req.files.file.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext === 'mp3' || file_ext === 'ogg'){

			Song.findByIdAndUpdate(songId, { file:file_name }, (err, songUpdated) => {
				if (err){
					res.status(500).send({message:'Error al actualizar la canción'});
				}else {
					if (!songUpdated){
						res.status(404).send({message:'No se ha podido actualizar la canción'});
					}else {
						res.status(200).send({song: songUpdated});
					}
				}
			});

		}else{
			res.status(200).send({ message : 'Extensión del archivo de audio no válida'});
		}

	}else {
		res.status(200).send({ message : 'No se ha subido ningún fichero de audio' });
	}
}


/*
*	GET IMAGE
*/
function getFile(req, res){
	var songFile = req.params.songFile;
	var pathFile = './uploads/songs/'+songFile;
	fs.exists(pathFile, function(exits){
		if (exits){
			res.sendFile(path.resolve(pathFile));
		}else {
			res.status(200).send({ message : 'No existe el fichero de audio...' });
		}
	});
}


module.exports = {
  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getFile
};
