'use strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../utils/greet.js'));


// /app2
router.get('/', function(req, res){
  res.render('app2_nightlife', greet(req));
});



module.exports = router;
