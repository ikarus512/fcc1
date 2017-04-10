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
router.get('/', function(req, res) {
  res.redirect('/app2/cafes');
});



// GET /app2/cafes - view cafes
router.get('/cafes', function(req, res) {
  var app2session = req.session.app2session;
  if (req.session.app2session) {
    app2session.app2session_lat = req.session.app2session.lat;
    app2session.app2session_lng = req.session.app2session.lng;
    app2session.app2session_zoom = req.session.app2session.zoom;
    app2session.app2session_radius = req.session.app2session.radius;
  };
  res.render('app2_nightlife', greet(req, app2session));
});



// RESTAPI GET    /app2/api/cafes?lat=DDD&lng=DDD&radius=DDD&zoom=DDD - get cafes
router.get('/api/cafes', function(req, res, next) {

  var radius = 188.796, lat = 56.312956, lng = 43.989955, zoom = 16; // Nizhny
  if (isFinite(Number(req.query.lat)))     lat = Number(req.query.lat);
  if (isFinite(Number(req.query.lng)))     lng = Number(req.query.lng);
  if (isFinite(Number(req.query.zoom)))    radius = Number(req.query.zoom);
  if (isFinite(Number(req.query.radius)))  radius = Number(req.query.radius);

  req.session.app2session = req.query;

  getCafes({lat:lat, lng:lng, radius:radius})

  .then( function(cafes) {
    res.status(200).json(cafes);
  })

  .catch( function(err) {
    myErrorLog(null, err);
    res.status(400).json([]);
  });

});

module.exports = router;
