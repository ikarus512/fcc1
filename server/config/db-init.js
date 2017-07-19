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

var dbInit;

if (process.env.NODE_ENV === 'production') {
    dbInit = require('./db-init-production.js');
} else {
    dbInit = require('./db-init-test.js');
}

module.exports = dbInit;
