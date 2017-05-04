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
  Promise = require('bluebird'),
  myErrorLog = require('../utils/my-error-log.js');

function dbInit(done) {

  var promises = [

    User.createAdmin()
      .catch( function(err) { myErrorLog(null, err); return; }),

    User.createLocalUser({username: 'me', password: 'me', password2: 'me' })
      .catch( function(err) { myErrorLog(null, err); return; }),

    User.createLocalUser({username: 'me1', password: 'me1', password2: 'me1' })
      .catch( function(err) { myErrorLog(null, err); return; }),

    User.createLocalUser({username: 'me2', password: 'me2', password2: 'me2' })
      .catch( function(err) { myErrorLog(null, err); return; }),

    User.createLocalUser({username: 'me3', password: 'me3', password2: 'me3' })
      .catch( function(err) { myErrorLog(null, err); return; }),

  ];

  setTimeout( function() {
    Promise.all(promises)

    .then( function() {
      return done();
    })

    .catch( function(err) {
      // no throw to ignore errors
      myErrorLog(null, err);
      return done();
    });
  }, 5000);

  return Promise.resolve();
}

module.exports = dbInit;
