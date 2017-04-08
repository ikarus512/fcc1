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
  request = require('request'),
  Promise = require('bluebird'),
  cafeFilter = require('./cafe-filter.js');

// Using Google Place Search API
function getCafes(lat, lng, r){

  return new Promise( function(resolve, reject) {

    request.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
      '?key=' + process.env.APP_GOOGLE_MAPS_API_KEY +
      '&location=' + lat + ',' + lng +
      '&radius=' + r +
      '&types=cafe|bar|restaurant' +
      '',

      function(err, response, data) {

        if (err) throw err;

        if (response.statusCode !== 200)
          throw Error('Google Maps API response statusCode='+response.statusCode+'.');

        return resolve(JSON.parse(data));
      }

    );

  })

  .then( function(data) {
    // data.next_page_token
    // can be used to return next 20 search results
    // in next request
    return cafeFilter(data);
  });

}

module.exports = getCafes;
