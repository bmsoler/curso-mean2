'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
  var artistId = req.params.id;
  Artist.findById(artistId, (err, artist) => {
    if (err){
      res.status(500).send({message:'Error en la petición'});
    }else {
      if (!artist){
        res.status(404).send({message:'No se ha encontrado el artista'});
      }else{
        res.status(200).send({artist:artist});
      }
    }
  });
}

function saveArtist(req, res){
  var artist = new Artist();
  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = params.image;
  //Guardar el artista
  artist.save((err, artistStored) => {
    if (err){
      res.status(500).send({message:'Error al guardar el artista'});
    }else {
      if (!artistStored){
        res.status(404).send({message:'No se ha registrado el artista'});
      }else{
        res.status(200).send({artist:artistStored});
      }
    }
  });
}

function getArtists(req, res){
  var page = 1;
  if (req.params.page){
    page = req.params.page;
  }
  var itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
    if (err) {
      res.status(500).send({message:'Error en la petición'});
    }else {
      if (!artists){
        res.status(404).send({message:'No ahi artistas !!!'});
      }else{
        return res.status(200).send({
          artists : artists,
          total_items : total
        });
      }
    }
  });
}

/*
*	UPDATE ARTIST
*/
function updateArtist(req, res){

	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err){
			res.status(500).send({message:'Error al actualizar el artista'});
		}else {
			if (!artistUpdated){
				res.status(404).send({message:'No se ha podido actualizar el artista'});
			}else {
				res.status(200).send({artistUpdated});
			}
		}
	});
}

/*
*	DELETE ARTIST
*/
function deleteArtist(req, res){

	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err){
			res.status(500).send({message:'Error al borrar el artista'});
		}else {
			if (!artistRemoved){
				res.status(404).send({message:'No se ha podido borrar el artista'});
			}else {

        //Borramos todos los albumes del artista
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
          if (err){
            res.status(500).send({message:'Error al borrar el album'});
          }else {
            if (!albumRemoved){
              res.status(404).send({message:'No se ha podido borrar el album'});
            }else {

              //Borramos todas las canciones del album
              Song.find({artist: artistRemoved._id}).remove((err, songRemoved) => {
                if (err){
                  res.status(500).send({message:'Error al borrar la canción'});
                }else {
                  if (!songRemoved){
                    res.status(404).send({message:'No se ha podido borrar la canción'});
                  }else {

                    res.status(200).send({artist:artistRemoved});

                  }
                }
              });
            }
          }
        });
			}
		}
	});
}



module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist
};
