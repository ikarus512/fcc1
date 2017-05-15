/* file: app4.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App4 Routes
 * AUTHOR: ikarus512
 * CREATED: 2017/04/20
 *
 * MODIFICATION HISTORY
 *  2017/04/20, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
'use strict';


var express = require('express'),
  router = express.Router(),
  path = require('path'),
  wsStore = require('./../utils/app4/web-socket-store.js'),
  greet = require(path.join(__dirname, '../utils/greet.js')),
  Promise = require('bluebird'),
  PublicError = require('../utils/public-error.js'),
  myErrorLog = require('../utils/my-error-log.js'),
  Book = require('../models/app4-books.js'),
  upload = require('multer')({ dest: path.join(__dirname, '../../_tmp') });



// GET /app4 - redirected to /app4/books
router.get('/', function(req, res) {
  res.redirect('/app4/books');
});

// GET /app4/books - view books
router.get('/books', function(req, res) {
  res.render('app4_books', greet(req));
});

// GET /app4/books/:id - view book
router.get('/books/:id', function(req, res) {
  var uid;
  if (req.isAuthenticated()) uid = req.user._id;
  res.render('app4_book', greet(req,{uid:uid, bookId:req.params.id}));
});




// GET /app4/api/books - get books
router.get('/api/books', function(req, res, next) {

  Book.getBooks()

  // Send the response back
  .then( function(books) {
    return res.status(200).json(books);
  })

  // On fail, send error response
  .catch( PublicError, function(err) {
    return res.status(400).json({message:err.toString()});
  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e000000b.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});

// GET /app4/api/books/:id - get book
router.get('/api/books/:id', function(req, res, next) {

  var uid;
  if (req.isAuthenticated()) uid = req.user._id;

  // Find book by id
  Book.getBook(req.params.id,uid)

  // Send the response back
  .then( function(book) {
    return res.status(200).json(book);
  })

  // On fail, send error response
  .catch( PublicError, function(err) {
    return res.status(400).json({message:err.toString()});
  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e000000c.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});

// DELETE /app4/api/books/:id - delete book
router.delete('/api/books/:id', function(req, res, next) {

  var uid;
  if (req.isAuthenticated()) uid = req.user._id;

  Book.removeBook(req.params.id, uid)

  // Send the response back
  .then( function() {
    return res.status(200).json();
  })

  // On fail, send error response
  .catch( PublicError, function(err) {
    return res.status(400).json({message:err.toString()});
  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e000000d.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});

// RESTAPI POST   /app4/api/books {title,...} - create/update book (authorized only)
router.post('/api/books', upload.single('file'), function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.status(401).json({message:'Error: Only authorized person can create/update a book.'});
  }

  Book.addBook({
    _id: req.body._id,
    title: req.body.title,
    price: Number(req.body.price),
    keywords: req.body.keywords,
    description: req.body.description,
    createdBy: req.user._id,
    photoId: req.body.photoId,
    file: req.file,
  })

  // Send the response back
  .then( function(book) {
    wsStore.broadcastRefreshDetails(book._id);
    return res.status(200).json(book);
  })

  // On fail, send error response
  .catch( PublicError, function(err) {
    return res.status(400).json({message:err.toString()});
  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e000000a.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});

// POST /app4/api/books/:id/bid {price} - add bid
router.post('/api/books/:id/bid', function(req, res, next) {

  var bookId = req.params.id;

  var uid;
  if (req.isAuthenticated()) uid = req.user._id;

  // Add bid
  Book.addBid(bookId, req.body.price, uid)

  // Send the response back
  .then( function(book) {
    wsStore.broadcastRefreshBids(book._id);
    return res.status(200).json(book);
  })

  // On fail, send error response
  .catch( PublicError, function(err) {
    return res.status(400).json({message:err.toString()});
  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e0000011.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});

// POST /app4/api/books/:bookId/choose {bidOwnerId} - choose bid to finish trade
router.post('/api/books/:bookId/choose', function(req, res, next) {

  var bookId = req.params.id;

  var uid;
  if (req.isAuthenticated()) uid = req.user._id;

  // Add bid
  Book.chooseBid(bookId, req.body.bidOwnerId, uid)

  // Send the response back
  .then( function(book) {
    wsStore.broadcastRefreshDetails(bookId);
    return res.status(200).json(book);
  })

  // On fail, send error response
  .catch( PublicError, function(err) {
    return res.status(400).json({message:err.toString()});
  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e0000012.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});

// RESTAPI GET    /app4/api/get-ws-ticket - get web socket ticket
router.get('/api/get-ws-ticket', function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.status(401).json({message:'Error: Only authorized person can get Web Socket ticket.'});
  }

  try {

    var ticket = wsStore.ticketGenerate(req.user.name);

    return res.status(200).json({ticket: ticket});

  } catch(err) {

    if (err instanceof PublicError) {
      return res.status(400).json({message:err.toString()});
    } else {
      var message = 'Internal error e0000013.';
      myErrorLog(null, err, message);
      return res.status(400).json({message:message});
    }

  }

});

module.exports = router;
