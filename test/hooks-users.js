/* file:  */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: 
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

// Create local users:
//    local.username=a, password=a
//    local.username=b, password=b
//    unauthorize.ip=x.x.x.y

module.exports = function() {

  var
    User = require('./../server/models/users'),
    createAdmin = require('./../server/models/create-admin.js');


  before( function(done) {
    // We don't return promise here and use done() callback
    // to support protractor mocha.

    createAdmin()

    .then( function() {
      return User.createLocalUser({username: 'a', password: 'a', password2: 'a' });
    })

    .then( function() {
      return User.createLocalUser({username: 'b', password: 'b', password2: 'b' });
    })

    .then( function(createdUser) {
      return User.createUnauthorizedUser('x.x.x.y');
    })

    .then( function(createdUser) {
      return done();
    })

    .catch( function(err) {
      throw err;
    });

  });

};
