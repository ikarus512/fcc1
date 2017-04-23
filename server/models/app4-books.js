/* file: app4-books.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Book Model
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
  PublicError = require('./../utils/public-error.js'),
  myErrorLog = require('./../utils/my-error-log.js'),
  BookPhoto = require('./../models/app4-bookphotos.js');

mongoose.Promise = Promise;


////////////////////////////////////////////////////////////////
//  BookSchema
////////////////////////////////////////////////////////////////

var BookSchema = new Schema({
  title: {type: String, required: true},
  keywords: [String],
  description: String,
  createdBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  // price: {type: Number, required: true},
  photo: {type: mongoose.Schema.Types.ObjectId, ref: 'BookPhoto'},
  requests: [{
    requestedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    price: {type: Number, required: true},
  }],
},
{ // options
  versionKey: false, // do not use __v property
  // bufferCommands: false,
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// getBooks
BookSchema.statics.getBooks = function() {

  var filteredBooks;

  return BookModel().find({}).exec()

  // Filter book data
  .then( function(books) {
    var promises = [];
    filteredBooks = books.map( function(book) {
      var newBook = {};
      newBook.title = book.title;
      newBook.keywords = book.keywords.join(',');
      newBook.description = book.description;
      newBook.createdBy = book.createdBy;
      if (book.photo) {
        newBook.photo = '/img/app4tmp/' + book.photo + '.jpg';
        promises.push(BookPhoto.getBookPhoto(book.photo));
      }
      return newBook;
    });
    return Promise.all(promises);
  })

  .then( function() {
    return filteredBooks;
  });

};

// addBook
BookSchema.statics.addBook = function(book) {

  // Save photo file to DB if any, and return photoId
  return BookPhoto.addBookPhoto(book.file)

  // Save book
  .then( function(photoId) {

    return new Promise( function(resolve, reject) {
      var newBook = new BookModel()();
      newBook.title = book.title;
      newBook.photo = photoId;
      newBook.createdBy = book.createdBy;
      if (book.keywords) {
        newBook.keywords = book.keywords.split(',');
      }
      newBook.description = book.description;
      // newBook.photo = book.file;
      return resolve(newBook.save());
    });

  });

};


////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function BookModel() {
  return mongoose.model('Book', BookSchema);
}

module.exports = mongoose.model('Book', BookSchema);
