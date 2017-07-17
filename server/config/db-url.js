/* file: db-url.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: DataBase Url
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var APPCONST = require('./../config/constants.js');

var dbUrl = APPCONST.env.APP_MONGODB_URI;

module.exports = dbUrl;
