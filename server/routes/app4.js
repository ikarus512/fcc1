'use strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../utils/greet.js'));


// /app4
router.get('/', function(req, res){
  res.render('app4_books', greet(req));
});



module.exports = router;
