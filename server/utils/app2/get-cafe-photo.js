/* file: get-cafe-photo.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Get Cafe Photo
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
  // APPCONST = require('./../../config/constants.js'),
  Promise = require('bluebird');

// Using Google Place Photos API
function getCafePhoto(googlePhotoRef) {

    // return new Promise( function(resolve, reject) {

    //   request.get(
    //     'https://maps.googleapis.com/maps/api/place/photo' +
    //     '?maxwidth=50&maxheight=50' +
    //     '&photoreference=' + googlePhotoRef +
    //     '?key=' + APPCONST.env.APP_GOOGLE_MAPS_API_KEY +
    //     '',

    //     function(err, response, data) {

    //       if (err) throw err;

    //       if (response.statusCode !== 200)
    //         throw Error('Google Place Photo API response statusCode='+response.statusCode+'.');

    //       return resolve(JSON.parse(data));
    //     }

    //   );

    // })

    // .then( function(data) {
    //   //data.next_page_token
    //   return cafeFilter(data);
    // });

}

module.exports = getCafePhoto;
