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

// Create 2 polls

module.exports = function() {

  var
    User = require('./../server/models/users'),
    Poll = require('./../server/models/polls'),

    userA,
    userB,
    userU;

  before( function(done) {
    // We don't return promise here and use done() callback
    // to support protractor mocha.

    // First, find all needed users
    User.findOneMy({'local.username': 'a'})
    .then( function(user) {
      if (!user) throw Error('Local user a not found');
      userA = user;
      return User.findOneMy({'local.username': 'b'});
    })
    .then( function(user) {
      if (!user) throw Error('Local user b not found');
      userB = user;
      return User.findOneMy({'unauthorized.ip': 'x.x.x.y'});
    })
    .then( function(user) {
      if (!user) throw Error('Unauthorized user not found');
      userU = user;
      return;
    })

    // Create poll 1
    .then( function() {
      var p = new Poll();
      p.title = 'Poll 1';
      p.createdBy = userA._id;
      p.options = [
        {title: 'Option 1', votes:[userB._id]},
        {title: 'Option 2', votes:[]},
      ];
      return p.save();
    })

    // Create poll 2
    .then( function() {
      var p = new Poll();
      p.title = 'Poll 2';
      p.createdBy = userB._id;
      p.options = [
        {title: 'Option 1', votes:[userB._id,userA._id]},
        {title: 'Option 2', votes:[userU._id]}, 
      ];
      return p.save();
    })

    .then( function() {
      done();
    })

    .catch( function(err) {
      throw err;
    });

  });

};
