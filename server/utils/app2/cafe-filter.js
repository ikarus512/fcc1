/* file: cafe-filter.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Cafe Filter
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 *
 *
 * ALGORITHM DETAILS
 *
 *  Each cafe object:
 *
 *    - Receices its photo. More detailed:
 *      - photo downloaded from Google Place Photo API
 *      - photo binary saved in static directory
 *
 *    - Is saved to DB cafes and gets _id. More detailed:
 *      - if cafe already present in DB, just return it
 *      - if not:
 *        - data is stored not more than for 2 weeks
 *
 */

/*jshint node: true*/
'use strict';

function cafeFilter(cafes){

  return cafes.results

  // .filter( function(cafe) {
  //   return cafe.type
  // })

  .map( function(cafe) {

    var res = {};

    res._id = 0;
    try{ res.lat = cafe.geometry.location.lat; } catch(err) {}
    try{ res.lng = cafe.geometry.location.lng; } catch(err) {}
    try{ res.name= cafe.name; } catch(err) {}
    try{ res.text= cafe.vicinity; } catch(err) {} // address
    try{ res.icon= cafe.icon; } catch(err) {}
    try{ res.google_id= cafe.id; } catch(err) {}
    try{ res.google_photo_ref= cafe.photos[0].photo_reference; } catch(err) {}
    try{ res.google_place_id= cafe.place_id; } catch(err) {}

    return res;

  });

}

module.exports = cafeFilter;
