/* file: refresh-cafes-google.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Refresh DB with Cafes from Google
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
  GOOGLE_SEARCH_ENABLED = true,
  request = require('request'),
  Promise = require('bluebird'),
  Cafe = require('./../../models/app2-cafes.js'),
  myErrorLog = require('../../utils/my-error-log.js'),
  MAPS_SEARCH_LIMIT = require('./../../config/maps-search-limit.js'),
  GOOGLE_DELAY_BETWEEN_REQUESTS = 2000;

function googleRequest(lat, lng, radius, dataIn) {

  // Delay between google requests
  return new Promise( function(resolve, reject) {
    if (dataIn.results.length) {
      setTimeout( function() {
        return resolve(dataIn);
      }, GOOGLE_DELAY_BETWEEN_REQUESTS);
    } else { // First requests in a loop -- no delay before it
      return resolve(dataIn);
    }
  })

  .then( function() {

    ////////////////////////////////////////////////////////////
    //

    return new Promise( function(resolve, reject) {

      request.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?key=' + process.env.APP_GOOGLE_MAPS_API_KEY +
        '&location=' + lat + ',' + lng +
        '&radius=' + radius +
        '&types=cafe|bar|restaurant' +
        (dataIn.next_page_token ? ('&pagetoken=' + dataIn.next_page_token) : '') +
        '',

        function requestHandler(err, response, data) {

          try {

            if (err) throw err;

            if (response.statusCode !== 200)
              throw Error('Google Maps API response statusCode='+response.statusCode+'.');

            // New portion of results
            var dataObj = JSON.parse(data);

            if (!dataObj.results)
              throw Error('Google Maps API response without results: '+data+'.');

            if (dataObj.status && dataObj.status !== 'OK')
              throw Error('Google Maps API error: '+data+'.');

            if (dataObj.results.length === 0)
              throw Error('Google Maps API no results: '+data+'.');

            // Concatenate with previous portion of results
            dataObj.results = dataObj.results.concat(dataIn.results);

            if (dataObj.results.length >= MAPS_SEARCH_LIMIT) {

              delete dataObj.next_page_token; // Stop request loop

              dataObj.results = dataObj.results.filter( function(el,idx) {
                return (idx < MAPS_SEARCH_LIMIT);
              });

            }

            return resolve(dataObj);

          } catch(err) {

            return reject(err);

          }

        } // function requestHandler(...)

      ); // request.get(...)

    });

    //
    ////////////////////////////////////////////////////////////

  })

  .then( function(data) {
    return data;
  });

  // .catch( function(err) {
  //   myErrorLog(null, err);
  //   return {results:[]};
  // });

} // function googleRequest(...)

function googleRequestLoop(lat, lng, radius, dataIn) {

  if (!dataIn) { // Here if first request
    return googleRequest(lat, lng, radius, { results: [] })
    .then( function(data) { // Make request loop
      return googleRequestLoop(lat, lng, radius, data);
    });
  }

  // Here if further requests
  if (dataIn.next_page_token) { // Continue requesting Google?
    return googleRequest(lat, lng, radius, dataIn)
    .then( function(data) { // Make request loop
      return googleRequestLoop(lat, lng, radius, data);
    });
  }

  return dataIn;

} // function googleRequestLoop(...)

function cafeFilterAndSave(cafes){

  //
  //  1) Filter cafes useful data
  //

  var filteredCafes = cafes

  .map( function(cafe) {

    var newCafe = { google: {} };

    // newCafe._id = 0;
    try{ newCafe.lat = cafe.geometry.location.lat; } catch(err) {}
    try{ newCafe.lng = cafe.geometry.location.lng; } catch(err) {}
    try{ newCafe.name = cafe.name; } catch(err) {}
    try{ newCafe.text = cafe.vicinity; } catch(err) {} // address
    try{ newCafe.photo = cafe.icon; } catch(err) {}
    try{ newCafe.google.icon = cafe.icon; } catch(err) {}
    try{ newCafe.google.id = cafe.id; } catch(err) {}
    try{ newCafe.google.photo_reference = cafe.photos[0].photo_reference; } catch(err) {}
    try{ newCafe.google.place_id = cafe.place_id; } catch(err) {}

    return newCafe;

  });

  //
  //  2) save cafes to DB
  //
  var cafePromises = filteredCafes.map( function(cafe) {
    return Cafe.updateCafe(cafe);
  });

  //
  //  3) Return filtered cafes
  //
  return Promise.all(cafePromises)

  .then( function(cafes) {
    return cafes;
  })

  .catch( function(err) {
    myErrorLog(null, err); // log error
    return [];
  });


} // function cafeFilterAndSave(...)

function refreshCafesGoogle(lat, lng, radius) {

  if (GOOGLE_SEARCH_ENABLED) {

    return googleRequestLoop(lat, lng, radius)

    .then( function(data) {
      var cafes = data.results;
      return cafeFilterAndSave(cafes);
    })

    .catch( function(err) {
      myErrorLog(null, err);
      return [];
    });

  } else {

    var err = new Error('Google search disabled in file ' + __filename);
    myErrorLog(null, err);
    return Promise.resolve([]);

  }

} // function refreshCafesGoogle(...)

module.exports = refreshCafesGoogle;
