'use strict';

// Create 2 polls

module.exports = function() {

  var
    User = require('./../../server/models/users'),
    Poll = require('./../../server/models/polls'),

    userA,
    userB,
    userU;

  before( function() {

    // First, find all needed users
    return User.findOneMy({'local.username': 'a'})
    .then( function(user) {
      if (!user) throw Error('Local user a not found');
      userA = user;
      return User.findOneMy({'local.username': 'b'})
    })
    .then( function(user) {
      if (!user) throw Error('Local user b not found');
      userB = user;
      return User.findOneMy({'unauthorized.ip': 'x.x.x.y'})
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

    .catch( function(err) {
      throw err;
    });

  });

};
