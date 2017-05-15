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
  BookPhoto = require('./../models/app4-bookphotos.js'),
  User = require('./../models/users.js');

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

  tradeFinished: {type: Boolean, required: true, default: false},
  bids: [{
    by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    price: {type: Number, required: true},
    chosen: {type: Boolean, required: true, default: false},
    msgs: [{
      at: Date,
      by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      text: String,
    }],
  }],
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// getBooks
BookSchema.statics.getBooks = function() {

  var filteredBooks;

  return BookModel().find({}).populate('createdBy').exec()

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
      newBook.tradeFinished = book.tradeFinished;
      if (book.createdBy) {
        newBook.ownerId = book.createdBy._id;
        newBook.ownerName = book.createdBy.name;
      } else {
        newBook.ownerId = null;
        newBook.ownerName = 'no user';
      }
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

}; // getBooks


// getBook
BookSchema.statics.getBook = function(bookId,uid) {

  var newBook;

  return BookModel().findOne({_id:bookId}).populate(['createdBy','bids.by','bids.msgs.by']).exec()

  // Filter book data
  .then( function(book) {
    if(!book) throw new PublicError('No book with _id='+bookId+'.');
    newBook = {};
    newBook.title = book.title;
    newBook._id = book._id;
    newBook.price = book.price;
    newBook.keywords = book.keywords ? book.keywords.join(', ') : '';
    newBook.description = book.description;
    newBook.tradeFinished = book.tradeFinished;
    if (book.createdBy) {
      newBook.ownerId = book.createdBy._id;
      newBook.ownerName = book.createdBy.name;
    } else {
      newBook.ownerId = null;
      newBook.ownerName = 'no user';
    }

    // Filter bids and messages
    newBook.bids = book.bids

    .map( function(bid) {

      // Msgs can be seen only by bidder and book owner
      var msgs = [];
      if ( bid.by._id.equals(uid) || newBook.ownerId.equals(uid) ) {
        if (bid.msgs) {
          msgs = bid.msgs.map( function(msg) {
            return {
              by: {_id: msg.by._id, name: msg.by.name},
              at: msg.at,
              text: msg.text,
            };
          });
        }
      }

      return {
        _id: bid._id,
        by: {
          _id: bid.by._id,
          name: bid.by.name,
        },
        price: bid.price,
        chosen: bid.chosen,
        msgs: msgs,
      };
    })

    .sort( function(a,b) {
      return b.price - a.price; // descending sort
    });

    if (book.photoId) {
      newBook.photoId = book.photoId;
      return BookPhoto.getBookPhoto(book.photoId);
    }
    return Promise.resolve();
  })

  .then( function() {
    return newBook;
  });

}; // getBook

// removeBook
BookSchema.statics.removeBook = function(bookId,uid) {

  return BookModel().findOne({_id:bookId}).exec()

  .then( function(book) {
    if (!book) throw new PublicError('No book with _id='+bookId+'.');
    if (!book.createdBy.equals(uid)) throw new PublicError('Only creator can remove the book.');
    return BookModel().findOneAndRemove({_id:bookId}).exec();
  });

}; // removeBook

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

}; // addBook


// addBid
BookSchema.statics.addBid = function(bookId, bidPrice, uid) {

  return BookModel().findOne({_id:bookId}).exec()

  .then( function(book) {
    if(!book) throw new PublicError('No book with _id='+bookId+'.');

    // Find/update bid
    var bidIdx;
    var found = book.bids.some( function(bid,idx) {
      bidIdx = idx;
      return bid.by.equals(uid);
    });
    if (found) {
      book.bids[bidIdx].price = bidPrice;
    } else {
      book.bids.push({by:uid, price:bidPrice});
    }

    return book.save();

  });

}; // addBid


// addMsg
BookSchema.statics.addMsg = function(bookId, from, to, time, text) {

  return BookModel().findOne({_id:bookId}).exec()

  .then( function(book) {
    if(!book) throw new PublicError('No book with _id='+bookId+'.');

    if(!book.createdBy.equals(from) && !book.createdBy.equals(to))
      throw new PublicError('Incorrect from/to fields.');

    var bidId = (book.createdBy.equals(from)) ? to : from;

    // Find/update bid
    var bidIdx;
    var found = book.bids.some( function(bid,idx) {
      bidIdx = idx;
      return bid.by.equals(bidId);
    });
    if (found) {
      book.bids[bidIdx].msgs = book.bids[bidIdx].msgs || [];
      var msg = {
        at: time,
        by: from,
        text: text,
      };
      book.bids[bidIdx].msgs.push(msg);
    } else {
      throw new PublicError('Incorrect from/to fields (no such bid).');
    }

    return book.save();

  });

}; // addMsg


// chooseBid
BookSchema.statics.chooseBid = function(bookId, bidOwnerId, uid) {

  return BookModel().findOne({_id:bookId}).exec()

  .then( function(book) {

    if(!book) throw new PublicError('No book with _id='+bookId+'.');

    if(!book.createdBy.equals(uid)) throw new PublicError('Only book owner can finish trade.');


    // Find bid
    var bidIdx;
    var found = book.bids.some( function(bid,idx) {
      bidIdx = idx;
      return bid.by.equals(bidOwnerId);
    });
    if (!found) throw new PublicError('Book (id='+bookId+') does not have bid by user with _id='+bidOwnerId+'.');

    book.tradeFinished = true;
    book.bids[bidIdx].chosen = true;

    return book.save();

  });

}; // chooseBid


////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function BookModel() {
  return mongoose.model('Book', BookSchema);
}

module.exports = mongoose.model('Book', BookSchema);
