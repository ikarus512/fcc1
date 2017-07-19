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
  APPCONST = require('./../config/constants.js'),
  PublicError = require('../utils/public-error.js'),
  mapUtils = require('./../utils/app2/map-utils.js'),
  myErrorLog = require('./../utils/my-error-log.js'),
  MAPS_SEARCH_LIMIT = require('./../config/maps-search-limit.js');

mongoose.Promise = Promise;

var CafeSchema = new Schema({
    // Virtual properties:
    //  origin: {type:String}, // google/yelp/...

    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    language: {type: String, required: true, default: 'en'},
    name: {type: String, default: 'Cafe'},
    text: String,
    photo: String,
    google: {
        id: String,
        icon: String,
        photoRef: String,
        placeId: String,
    },

    // Visit plans represented as 1-hour-length time slots
    timeslots: [{
        start: {type: Date, required: true},
        users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    }],

    //createdAt: { type: Date, required:true, expires: '1m', default: Date.now },
    // // db.cafes.getIndexes(); db.cafes.dropIndex('createdAt_1')
    createdAt: {type: Date, required:true, default: Date.now},
    updatedAt: {type: Date, required:true, default: Date.now},
},
{ // options
    versionKey: false, // do not use __v property
    // capped: 100000, // this option does not allow document updates of growing size
    // Hence we need to cap collection manually. Though workaround possible:
    // http://www.solidsyntax.be/2016/03/26/ ...
    //    MongoDB-Cannot-change-the-size-of-a-document-in-a-capped-collection/
    timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'},
});

////////////////////////////////////////////////////////////////
//  virtuals
////////////////////////////////////////////////////////////////

CafeSchema.virtual('origin').get(function() {
    var origin = 'N/A';
    try {
        if (this.google.id) { origin = 'google'; }
    } catch (err) {
    }

    return origin;
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// updateCafe
CafeSchema.statics.updateCafe = function(cafe) {
    if (cafe && cafe.google && cafe.google.id) {
        return CafeModel().updateOrInsertGoogleCafe(cafe);
    }

    myErrorLog(null, new Error('Unknown type of cafe.')); // log error
    cafe._id = 0;
    return Promise.resolve(cafe);
};

// updateOrInsertGoogleCafe
CafeSchema.statics.updateOrInsertGoogleCafe = function(cafe) {

    // limit database size to APPCONST.APP2_MAX_CAFES
    return CafeModel().findOne({'google.id': cafe.google.id}).exec()

    .then(function(cafe) {

        if (!cafe) { return CafeModel().count({}).exec(); } // Cafes collection size.

        // Here if cafe found.
        // Hence cafe needs only update (cafes collection size will not grow).
        return 0; // 0 < APPCONST.APP2_MAX_CAFES, it will allow updating the cafe.

    })

    .then(function(count) {
        if (count > APPCONST.APP2_MAX_CAFES) {
            throw new PublicError('Cafe collection size got its limit of ' +
                APPCONST.APP2_MAX_CAFES
            );
        }
        return;
    })

    // Now save/update cafe
    .then(function() {
        return CafeModel().findOneAndUpdate(
          {'google.id': cafe.google.id}, // find doc by google.id
          {$set: cafe}, // new document
          {upsert:true, new:true} // insert if not found; return new document
        ).exec();
    })

    .then(function(cafe) {
        return cafe;
    })

    .catch(function(err) {
        myErrorLog(null, err); // log error
        cafe._id = 0;
        return null;
    });

};

// findNearbyCafes
CafeSchema.statics.findNearbyCafes = function(userId, lat, lng, radius) {

    return CafeModel().find({
        // language: 'en',
        // origin: 'google',
        lat: {$gte: (Number(lat) - Number(radius)), $lt: (Number(lat) + Number(radius))},
        lng: {$gte: (Number(lng) - Number(radius)), $lt: (Number(lng) + Number(radius))},
    })
    .limit(5 * MAPS_SEARCH_LIMIT)
    .populate('timeslots.users')
    .exec()

    .then(function(cafes) {
        lat = Number(lat);
        lng = Number(lng);
        radius = Number(radius);

        return cafes

        // Filter out far cafes
        .filter(function(cafe) {
            var
              p1 = {lat: cafe.lat, lng: cafe.lng},
              p2 = {lat: lat,      lng: lng},
              dist = mapUtils.getDistance(p1, p2);
            return (dist <= radius);
        })

        // Limit search
        .filter(function(cafe, idx) { return (idx < MAPS_SEARCH_LIMIT); })

        // Filter internal fields, such as user id and password hash
        .map(function(cafe) {
            var newCafe = {};
            newCafe._id = cafe._id;
            newCafe.lat = cafe.lat;
            newCafe.lng = cafe.lng;
            newCafe.name = cafe.name;
            newCafe.text = cafe.text;
            newCafe.photo = cafe.photo;

            if (!cafe.timeslots) { cafe.timeslots = []; }

            newCafe.timeslots = cafe.timeslots.map(function(timeslot) {
                var newTimeslot = {
                    start: timeslot.start,
                };
                if (!timeslot.users) { timeslot.users = []; }

                // Check if user planned this timeslot
                newTimeslot.planned = timeslot.users.some(function(user) {
                    return user.equals(userId);
                });

                newTimeslot.users = timeslot.users.map(function(user) {
                    return user.name;
                });

                return newTimeslot;

            });

            return newCafe;

        });

    })

    // Filter out old timeslots
    .then(function(cafes) {

        // Allowed planned time t range:  min <= t < max
        var allowTimeMin = new Date();
        allowTimeMin.setMinutes(
          Math.floor(allowTimeMin.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
          APPCONST.APP2_TIMESLOT_LENGTH
        );
        allowTimeMin.setSeconds(0);
        allowTimeMin.setMilliseconds(0);
        var allowTimeMax = new Date(allowTimeMin);
        allowTimeMax.setMinutes(allowTimeMax.getMinutes() +
          APPCONST.APP2_TIMESLOT_LENGTH * APPCONST.APP2_MAX_TIMESLOTS
        );

        cafes.forEach(function(cafe) {

            if (!cafe.timeslots) { cafe.timeslots = []; }

            cafe.timeslots = cafe.timeslots.filter(function(timeslot) {

                return (timeslot.start >= allowTimeMin) &&
                  (timeslot.start < allowTimeMax);

            });

        });

        return cafes;

    })

    .catch(function(err) {
        myErrorLog(null, err); // log error
        return [];
    });

}; // CafeSchema.statics.findNearbyCafes(...)

// planTimeslot
CafeSchema.statics.planTimeslot = function(args) {

    // Get arguments
    var userId = args.userId;
    var cafeId = args.cafeId;
    var startTime = args.startTime;
    startTime.setMinutes(
      Math.floor(startTime.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
      APPCONST.APP2_TIMESLOT_LENGTH
    );
    startTime.setSeconds(0); startTime.setMilliseconds(0);

    // Allowed planned time t range:  min <= t < max
    var allowTimeMin = new Date();
    allowTimeMin.setMinutes(
      Math.floor(allowTimeMin.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
      APPCONST.APP2_TIMESLOT_LENGTH
    );
    allowTimeMin.setSeconds(0);
    allowTimeMin.setMilliseconds(0);
    var allowTimeMax = new Date(allowTimeMin);
    allowTimeMax.setMinutes(allowTimeMax.getMinutes() +
      APPCONST.APP2_TIMESLOT_LENGTH * APPCONST.APP2_MAX_TIMESLOTS
    );

    return new Promise(function(resolve, reject) {
        if (!userId) { throw new PublicError('user not authorized'); }
        if (!cafeId) { throw new PublicError('cafeId not specified'); }
        resolve();
    })

    // Find cafe by id
    .then(function() {
        return CafeModel().findOne({_id:cafeId}).exec();
    })

    .then(function(cafe) {

        if (!cafe) { // if not found, report error
            throw new PublicError('No cafe with id=' + cafeId + '.');
        }

        if (startTime < allowTimeMin) {
            throw new PublicError('Cannot plan in the past.');
        }

        if (startTime >= allowTimeMax) {
            throw new PublicError('Cannot plan too far in the future.');
        }

        return cafe;

    })

    // Find needed timeslot, add user there, save cafe
    .then(function(cafe) {

        if (!cafe.timeslots) { cafe.timeslots = []; }

        // Remove old timeslots (database cleanup)
        cafe.timeslots = cafe.timeslots.filter(function(timeslot) {
            return (timeslot.start >= allowTimeMin) &&
              (timeslot.start < allowTimeMax);
        });

        ///////////////////////

        // Find needed timeslot
        var timeslotIdx;
        var isfound = cafe.timeslots.some(function(timeslot, idx) {
            var found = (timeslot.start.getTime() === startTime.getTime());
            if (found) { timeslotIdx = idx; }
            return found;
        });
        if (!isfound) { // If not found, create it
            var neededTimeslot = {
                start: startTime,
                users: [],
            };
            cafe.timeslots.push(neededTimeslot);
            timeslotIdx = cafe.timeslots.length - 1;
        }

        // Check if user has already planned this timeslot before
        isfound = cafe.timeslots[timeslotIdx].users.some(function(user) {
            return userId.equals(user);
        });
        if (isfound) {
            throw new PublicError('You already planned this timeslot.');
        }

        // Add user to this timeslot
        cafe.timeslots[timeslotIdx].users.push(userId);

        // Save cafe
        return cafe.save();

    })

    .then(function() {
        return;
    });

}; // CafeSchema.statics.planTimeslot(...)

// unplanTimeslot
CafeSchema.statics.unplanTimeslot = function(args) {

    // Get arguments
    var userId = args.userId;
    var cafeId = args.cafeId;
    var startTime = args.startTime;
    startTime.setMinutes(
      Math.floor(startTime.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
      APPCONST.APP2_TIMESLOT_LENGTH
    );
    startTime.setSeconds(0); startTime.setMilliseconds(0);

    // Allowed planned time t range:  min <= t < max
    var allowTimeMin = new Date();
    allowTimeMin.setMinutes(
      Math.floor(allowTimeMin.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
      APPCONST.APP2_TIMESLOT_LENGTH
    );
    allowTimeMin.setSeconds(0);
    allowTimeMin.setMilliseconds(0);
    var allowTimeMax = new Date(allowTimeMin);
    allowTimeMax.setMinutes(allowTimeMax.getMinutes() +
      APPCONST.APP2_TIMESLOT_LENGTH * APPCONST.APP2_MAX_TIMESLOTS
    );

    return new Promise(function(resolve, reject) {
        if (!userId) { throw new PublicError('user not authorized'); }
        if (!cafeId) { throw new PublicError('cafeId not specified'); }
        resolve();
    })

    // Find cafe by id
    .then(function() {
        return CafeModel().findOne({_id:cafeId}).exec();
    })

    .then(function(cafe) {

        if (!cafe) { // if not found, report error
            throw new PublicError('No cafe with id=' + cafeId + '.');
        }

        if (startTime < allowTimeMin) {
            throw new PublicError('Cannot plan in the past.');
        }

        if (startTime >= allowTimeMax) {
            throw new PublicError('Cannot plan too far in the future.');
        }

        return cafe;

    })

    // Find needed timeslot, add user there, save cafe
    .then(function(cafe) {

        if (!cafe.timeslots) { cafe.timeslots = []; }

        // Remove old timeslots (database cleanup)
        cafe.timeslots = cafe.timeslots.filter(function(timeslot) {
            return (timeslot.start >= allowTimeMin) &&
              (timeslot.start < allowTimeMax);
        });

        // Find needed timeslot
        var timeslotIdx;
        var isfound = cafe.timeslots.some(function(timeslot, idx) {
            var found = (timeslot.start.getTime() === startTime.getTime());
            if (found) { timeslotIdx = idx; }
            return found;
        });
        if (!isfound) {
            throw new PublicError('No timeslot started at ' + startTime.toISOString());
        }

        // Find user in this timeslot
        var userIdx;
        isfound = cafe.timeslots[timeslotIdx].users.some(function(user, idx) {
            var found = userId.equals(user);
            if (found) { userIdx = idx; }
            return found;
        });
        if (!isfound) {
            throw new PublicError('You did not plan this timeslot before. Nothing to unplan.');
        }

        // Remove user from this timeslot
        cafe.timeslots[timeslotIdx].users.splice(userIdx,1);

        // Save cafe
        return cafe.save();

    })

    .then(function() {
        return;
    });

}; // CafeSchema.statics.unplanTimeslot(...)

////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function CafeModel() {
    return mongoose.model('Cafe', CafeSchema);
}

var collectionName = 'cafes';
module.exports = mongoose.model('Cafe', CafeSchema, collectionName);
