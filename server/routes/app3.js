'use strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../utils/greet.js'));


// /app3
router.get('/', function(req, res){
  res.render('app3_stock', greet(req));
});



module.exports = router;
