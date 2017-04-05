/* file: db-init-test.js */
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
  User = require('../models/users'),
  Poll = require('../models/polls'),
  Promise = require('bluebird'),
  dbUrl = require('./../../server/config/db-url.js'),
  mongoose = require('mongoose');

function dbInit(done) {

  var userA, userB, userU;

  //////////////////////////////////////////////////////////////
  // Clear DB:
  new Promise( function(resolve) {
    return clearSessionsCollection(resolve);
  })
  .then( function() {
    return new Promise( function(resolve) {
      return clearDB(resolve);
    });
  })

  //////////////////////////////////////////////////////////////
  // Create users:
  //  local.username=admin, password=1234
  //  local.username=a, password=a
  //  local.username=b, password=b
  //  unauthorized.ip=x.x.x.y
  .then( function() {
    return User.createAdmin();
  })
  .then( function(createdUser) {
    return User.createLocalUser({username: 'a', password: 'a', password2: 'a' });
  })
  .then( function(createdUser) {
    userA = createdUser;
    return User.createLocalUser({username: 'b', password: 'b', password2: 'b' });
  })
  .then( function(createdUser) {
    userB = createdUser;
    return User.createUnauthorizedUser('x.x.x.y');
  })
  .then( function(createdUser) {
    userU = createdUser;
    return;
  })

  //////////////////////////////////////////////////////////////
  // Create app1 test data:
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
    return done();
  })

  .catch( function(err) {
    throw err;
  });
}



function clearSessionsCollection(callback) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;
    db.collection('sessions').remove({}, function(err, result) {
      if (err) throw err;
      db.close(callback);
    });
  });
}

function clearDB(callback) {

  // function clearDBLoop() {
  //   for (var i in mongoose.connection.collections) {
  //     mongoose.connection.collections[i].remove( function() {} );
  //   }
  // }

  function clearDBLoop(callback) {
    var val = 0,
        i;
    for (i in mongoose.connection.collections) val++;
    for (i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(removeCallback);
    }

    function removeCallback() {
      val--; // (safe because no race condition in single-threaded node.js)
      if (val===0)
        if (callback) callback();
    }
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect(dbUrl, function (err) {
      if (err) throw err;
      clearDBLoop(callback);
    });
  } else {
    clearDBLoop(callback);
  }
}

module.exports = dbInit;
