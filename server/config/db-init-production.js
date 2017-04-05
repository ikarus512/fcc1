/* file: db-init-production.js */
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

var User = require('../models/users');

function dbInit(done) {
  User.createAdmin()
  .then( function() {
    return done();
  });
}

module.exports = dbInit;
