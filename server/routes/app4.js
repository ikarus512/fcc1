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



// RESTAPI POST   /app4/api/books {title,...} - create new book (authorized only)
router.post('/api/books', upload.single('file'), function(req, res, next) {

  if (!req.isAuthenticated()) {
    return res.status(401).json({message:'Error: Only authorized person can create new book.'});
  }

  Book.addBook({
    title: req.body.title,
    keywords: req.body.keywords,
    description: req.body.description,
    createdBy: req.user._id,
    file: req.file,
  })

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
    var message = 'Internal error e000000a.';
    myErrorLog(null, err, message);
    return res.status(400).json({message: message});
  });

});



module.exports = router;
