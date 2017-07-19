/* file: app-users-init.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Apps Users Initializations
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

  User = require('./../../server/models/users.js'),
  Promise = require('bluebird'),

  userA, userB, userU; // a, b, unonimous

function usersInit() {

  //////////////////////////////////////////////////////////////
  // Create users:
  //  local.username=admin, password=1234
  //  local.username=a, password=a
  //  local.username=b, password=b
  //  unauthorized.ip=x.x.x.y

    var promises = [

      User.createAdmin(),

      User.findOneMy({ 'local.username': 'a' })
      .then( function(user) { userA = user; })
      .catch( function(err) {
        return User.createLocalUser({username: 'a', password: 'a', password2: 'a' })
        .then( function(user) { userA = user; });
      }),

      User.findOneMy({ 'local.username': 'b' })
      .then( function(user) { userB = user; })
      .catch( function(err) {
        return User.createLocalUser({username: 'b', password: 'b', password2: 'b' })
        .then( function(user) { userB = user; });
      }),

      User.createUnauthorizedUser('x.x.x.y')
      .then( function(createdUser) { userU = createdUser; }),

    ];

    return Promise.all(promises)

    .then( function() {
      return {
        userA: userA,
        userB: userB,
        userU: userU,
      };
    });

}

module.exports = usersInit;
