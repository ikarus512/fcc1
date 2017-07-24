/* file: db-connect.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Mongoose Connect
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

// Mongoose connection to DB.
// Stops http/s server when DB connection error.

var
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    dbUrl = require('./../config/db-url.js');

mongoose.Promise = Promise;

module.exports = function () {

    mongoose.connect(dbUrl, function() {});

};
