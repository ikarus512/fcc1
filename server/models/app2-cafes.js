/* file: app2-cafes.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Cafe Model
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
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schema = mongoose.Schema,
  mapUtils = require('./../utils/app2/map-utils.js'),
  myErrorLog = require('./../utils/my-error-log.js'),
  MAPS_SEARCH_LIMIT = require('./../config/maps-search-limit.js');

mongoose.Promise = Promise;



var CafeSchema = new Schema({
  // Virtual properties:
  // origin: {type:String}, // 'N/A'/google/yelp/...

  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  language: { type: String, required: true, default: 'en' },
  name: { type: String, default: 'Cafe' },
  text: String,
  photo: String,
  google: {
    id: String,
    icon: String,
    photo_ref: String,
    place_id: String,
  },

  // createdAt: { type: Date, required:true, expires: '1m', default: Date.now }, //db.cafes.getIndexes(); db.cafes.dropIndex('createdAt_1')

  visits: [{
    // createdAt: { type: Date, required:true, expires: '1m', default: Date.now },
    plannedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  }],
},
{ // options
  versionKey: false, // do not use __v property
  // timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

////////////////////////////////////////////////////////////////
//  virtuals
////////////////////////////////////////////////////////////////

CafeSchema.virtual('origin').get( function() {
  var origin = 'N/A';
  try {
    if(this.google.id)     origin = 'google';
  } catch(err) {
  }

  return origin;
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// updateCafe
CafeSchema.statics.updateCafe = function(cafe) {
  if (cafe && cafe.google && cafe.google.id) return CafeModel().updateGoogleCafe(cafe);

  myErrorLog(null, new Error('Unknown type of cafe.')); // log error
  cafe._id = 0;
  return cafe;
};

// updateGoogleCafe
CafeSchema.statics.updateGoogleCafe = function(cafe) {

  return CafeModel().findOneAndUpdate(
    { 'google.id': cafe.google.id }, // find doc by google.id
    { $set: cafe }, // inserting document, if not found
    { upsert:true, new:true } // insert if not found; return new document
  ).exec()

  .then( function(cafe) {
    return cafe;
  })

  .catch( function(err) {
    myErrorLog(null, err); // log error
    cafe._id = 0;
    return cafe;
  });

};

// findNearbyCafes
CafeSchema.statics.findNearbyCafes = function(lat, lng, radius) {

  return CafeModel().find({
    // language: 'en',
    // origin: 'google',
    lat: { $gte: (Number(lat)-Number(radius)), $lt: (Number(lat)+Number(radius)) },
    lng: { $gte: (Number(lng)-Number(radius)), $lt: (Number(lng)+Number(radius)) },
  })
  .limit(5*MAPS_SEARCH_LIMIT)
  .exec()

  .then( function(cafes) {
    lat = Number(lat);
    lng = Number(lng);
    radius = Number(radius);

    return cafes.filter( function(cafe) {
      var
        p1 = {lat: cafe.lat, lng: cafe.lng },
        p2 = {lat: lat,      lng: lng },
        dist = mapUtils.getDistance(p1, p2);
      return (dist <= radius);
    })
    .filter( function (cafe, idx) { return (idx < MAPS_SEARCH_LIMIT); });
  })

  .catch( function(err) {
    myErrorLog(null, err); // log error
    return [];
  });

};


////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function CafeModel() {
  return mongoose.model('Cafe', CafeSchema);
}

var collectionName = 'cafes';
module.exports = mongoose.model('Cafe', CafeSchema, collectionName);
