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
  price: {type: Number, required: true},
  photoId: {type: mongoose.Schema.Types.ObjectId, ref: 'BookPhoto'},
  requests: [{
    requestedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    price: {type: Number, required: true},
  }],
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
      newBook._id = book._id;
      newBook.price = book.price;
      newBook.keywords = book.keywords ? book.keywords.join(', ') : '';
      newBook.description = book.description;
      newBook.createdBy = book.createdBy;
      if (book.photoId) {
        newBook.photoId = book.photoId;
        promises.push(BookPhoto.getBookPhoto(book.photoId));
      }
      return newBook;
    });
    return Promise.all(promises);
  })

  .then( function() {
    return filteredBooks;
  });

};


// getBook
BookSchema.statics.getBook = function(id) {

  var newBook;

  return BookModel().findOne({_id:id}).exec()

  // Filter book data
  .then( function(book) {
    if(!book) throw new PublicError('No book with _id='+id+'.');
    newBook = {};
    newBook.title = book.title;
    newBook._id = book._id;
    newBook.price = book.price;
    newBook.keywords = book.keywords ? book.keywords.join(', ') : '';
    newBook.description = book.description;
    newBook.createdBy = book.createdBy;
    if (book.photoId) {
      newBook.photoId = book.photoId;
      return BookPhoto.getBookPhoto(book.photoId);
    }
    return Promise.resolve();
  })

  .then( function() {
    return newBook;
  });

};

// removeBook
BookSchema.statics.removeBook = function(id,uid) {

  return BookModel().findOne({_id:id}).exec()

  .then( function(book) {
    if (!book) throw new PublicError('No book with _id='+id+'.');
    if (!book.createdBy.equals(uid)) throw new PublicError('Only creator can remove the book.');
    return BookModel().findOneAndRemove({_id:id}).exec();
  });

};

// addBook
BookSchema.statics.addBook = function(book) {

  // Save photo file to DB if any, and return photoId
  return BookPhoto.addBookPhoto(book.file, book.photoId)

  // Save book
  .then( function(photoId) {

    var newBook = {};
    newBook.title = book.title;
    newBook.price = book.price;
    newBook.photoId = photoId;
    newBook.createdBy = book.createdBy;
    if (book.keywords) {
      newBook.keywords = book.keywords.split(',').map( function(keyword) { return keyword.trim(); });
    }
    newBook.description = book.description;


    if (book._id) {
      return BookModel().findOneAndUpdate(
        { _id: book._id }, // query
        { $set: newBook }, // new document
        { upsert:true, new:true } // insert if not found; return new document
      ).exec();
    } else {
      return new BookModel()(newBook).save();
    }

  });

};


////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function BookModel() {
  return mongoose.model('Book', BookSchema);
}

module.exports = mongoose.model('Book', BookSchema);
