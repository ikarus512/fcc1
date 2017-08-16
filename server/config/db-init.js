/* file: db-init.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: DB Initialization
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
    APPCONST = require('./../config/constants.js'),
    dbInitProduction = require('./db-init-production.js'),
    dbInitTest = require('./db-init-test.js');

module.exports = (APPCONST.env.NODE_ENV === 'production') ?
    /*istanbul ignore next*/ dbInitProduction : dbInitTest;
