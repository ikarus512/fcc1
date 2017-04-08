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
 *  2017/04/06, ikarus512. Added autocreation of user me/me.
 *
 */

/*jshint node: true*/
'use strict';

var User = require('../models/users.js'),
  myErrorLog = require('../utils/my-error-log.js');

function dbInit(done) {
  User.createAdmin()

  .then( function() {
    return User.createLocalUser({username: 'me', password: 'me', password2: 'me' });
  })

  .then( function() {
    return done();
  })

  .catch( function(err) {
    // no throw to ignore errors
    myErrorLog(null, err);
    return done();
  });
}

module.exports = dbInit;
