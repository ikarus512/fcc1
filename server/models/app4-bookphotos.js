/* file: app4-bookphotos.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Book Photo Model
 * AUTHOR: ikarus512
 * CREATED: 2017/04/20
 *
 * MODIFICATION HISTORY
 *  2017/04/20, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
'use strict';

var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schema = mongoose.Schema,
  APPCONST = require('./../config/constants.js'),
  PublicError = require('../utils/public-error.js'),
  myErrorLog = require('./../utils/my-error-log.js'),

  path = require('path'),
  imageLib = require('jimp'),
  fs = Promise.promisifyAll(require("fs"));


mongoose.Promise = Promise;


////////////////////////////////////////////////////////////////
//  BookSchema
////////////////////////////////////////////////////////////////

var BookPhotoSchema = new Schema({
  img: { data: Buffer, contentType: String },
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// getBookPhoto
BookPhotoSchema.statics.getBookPhoto = function(id) {

  return BookPhotoModel().findOne({_id:id}).exec()

  // Get photo from DB to /publib/img/app4tmp dir
  .then( function(photo) {

    if (!photo) throw new Error('Photo '+id+' not found.');

    var fileName = path.join(__dirname, '../../public' + '/img/app4tmp/' + id + '.jpg');

    return fs.writeFileAsync(fileName, photo.img.data);

  });

};

// addBookPhoto
BookPhotoSchema.statics.addBookPhoto = function(file) {

  var photoId = null;

  if (!file) return Promise.resolve(photoId);



  var nameTmp1 = file.path + file.originalname;
  var nameTmp2 = file.path + '.jpg';

  // Rename to have original file extension
  return fs.renameAsync(file.path, nameTmp1)

  // Read
  .then( function() {
    return imageLib.read(nameTmp1);
  })

  // Convert, save to jpg
  .then( function(image) {
    image
      // .resize(imageLib.AUTO, 100)
      .resize(100, 100)
      .quality(70)
      .write(nameTmp2);
  })

  // Remove nameTmp1
  .then( function() {
    return fs.unlinkAsync(nameTmp1);
  })


  // save to DB, get DB id, remove tmp file, return id.
  .then( function() {
    return fs.readFileAsync(nameTmp2);
  })

  .then( function(data) {
    var photo = new BookPhotoModel()();
    photo.img.data = data;
    photo.img.contentType = 'image/jpg';
    return photo.save();
  })

  .then( function(photo) {
    photoId = photo._id;
    return;
  })

  // Remove nameTmp2
  .then( function() {
    return fs.unlinkAsync(nameTmp2);
  })

  .then( function() {
    return photoId;
  });

};


////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function BookPhotoModel() {
  return mongoose.model('BookPhoto', BookPhotoSchema);
}

module.exports = mongoose.model('BookPhoto', BookPhotoSchema);
