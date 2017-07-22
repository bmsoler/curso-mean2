'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Album = require('../models/album');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  var albumId = req.params.id;
  Album.findById(albumId, (err, album) => {
    if (err){
      res.status(500).send({message:'Error en la petición'});
    }else {
      if (!album){
        res.status(404).send({message:'No se ha encontrado el album'});
      }else{
        res.status(200).send({albul:album});
      }
    }
  });
}



module.exports = {
  getArtist
};
