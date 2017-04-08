/* file: app2.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App2 Routes
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  greet = require(path.join(__dirname, '../utils/greet.js')),
  getCafes = require('../utils/app2/get-cafes.js'),
  myErrorLog = require('../utils/my-error-log.js');

// GET /app2 - redirected to /app2/cafes
router.get('/', function(req, res){
  res.redirect('/app2/cafes');
});

// GET /app2/cafes - view cafes
router.get('/cafes', function(req, res){
  res.render('app2_nightlife', greet(req));
});

// RESTAPI GET    /app2/api/cafes - get cafes
router.get('/api/cafes', function(req, res, next){

  // Default search parameters
  var
    lat = 56.312956, // Nizhny
    lng = 43.989955,
    r = 500;

  if (req.body.lat) lat = req.body.lat;
  if (req.body.lng) lng = req.body.lng;
  if (req.body.r) r = req.body.r;

  getCafes(lat,lng,r)

  .then( function(cafes) {
    res.status(200).json(cafes);
  })

  .catch( function(err) {
    myErrorLog(null, err);
    res.status(400).json([]);
  });

});

module.exports = router;
