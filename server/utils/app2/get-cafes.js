/* file: get-cafes.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Get Nearby Cafes
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var
  Cafe = require('./../../models/app2-cafes.js'),
  myErrorLog = require('../../utils/my-error-log.js'),
  refreshCafesGoogle = require('./refresh-cafes-google.js');


function getCafes(obj){

  // Default search parameters
  var radius = 188.796, lat = 56.312956, lng = 43.989955; // Nizhny
  if (obj && obj.lat)     lat = obj.lat;
  if (obj && obj.lng)     lng = obj.lng;
  if (obj && obj.radius)  radius = obj.radius;
  var userId; if (obj) userId = obj.userId;

  // Refresh cafes DB (in background)
  refreshCafesGoogle(lat, lng, radius);

  // Request cafes DB
  return Cafe.findNearbyCafes(userId, lat, lng, radius)

  // If not found, refresh DB from Google
  .then( function(cafes) {
    // if (cafes.length === 0) {
    //   return refreshCafesGoogle(lat, lng, radius); // Try refresh DB again
    // }
    return cafes;
  })

  .catch( function(err) {
    myErrorLog(null, err);
    return [];
  });

}

module.exports = getCafes;
