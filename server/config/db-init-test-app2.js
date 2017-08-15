/* file: db-init-test-app2.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App2 Test Data
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
    Cafe = require('../models/app2-cafes.js'),
    cafes = require('./../../test/data/app2/cafes.js'),
    Promise = require('bluebird');

function myInit() {

    var promises = cafes.map(function(cafe) {
        return Cafe.findOneAndUpdate(
            {'google.id': cafe.google.id}, // find doc by google.id
            {$set: cafe}, // new document
            {upsert:true, new:true} // insert if not found; return new document
        ).exec();
    });

    return Promise.all(promises);

}

module.exports = myInit;
