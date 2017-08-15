/* file: init-app2.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App2 Test Initializations
 * AUTHOR: ikarus512
 * CREATED: 2017/07/18
 *
 * MODIFICATION HISTORY
 *  2017/07/18, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var
    Cafe = require('./../../server/models/app2-cafes.js'),
    cafes = require('./../data/app2/cafes.js'),
    Promise = require('bluebird'),
    usersInit = require('./init-users.js'),

    result;

function initApp2Data() {
    var resultTmp = {};

    if (result) {
        return Promise.resolve(result);
    }

    return usersInit()
    .then(function(res) {
        resultTmp.users = res;
        return res;
    })

    // Add cafes
    .then(function() {
        resultTmp.cafes = [];

        var promises = cafes.map(function(cafe) {
            resultTmp.cafes.push({
                _id: cafe._id,
                lat: cafe.lat,
                lng: cafe.lng,
                // google: cafe.google,
                photo: cafe.photo,
                text: cafe.text,
                name: cafe.name,
                timeslots: cafe.timeslots,
            });

            return Cafe.findOneAndUpdate(
                {'google.id': cafe.google.id}, // find doc by google.id
                {$set: cafe}, // new document
                {upsert:true, new:true} // insert if not found; return new document
            ).exec();
        });

        return Promise.all(promises);
    })
    .then(function(res) {
        result = resultTmp;
        return result;
    });
}

module.exports = initApp2Data;
