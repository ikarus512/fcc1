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
  User = require('../models/users.js'),
  Poll = require('../models/app1-polls.js'),
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


  //////////////////////////////////////////////////////////////
  // Create app2 test data:
  // Create 3 cafes

  // [
  //   {
  //     "_id" : ObjectId("58eb402a407bb511d1d395f4"),
  //     "google" : {
  //       "place_id" : "ChIJt-EgPK7VUUERYudX_RPE3RE",
  //       "id" : "fe8bf96e3645f854f94544038c5b3f9577002620",
  //       "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png"
  //     },
  //     "createdAt" : ISODate("2017-04-10T08:19:53.803Z"),
  //     "photo" : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
  //     "text" : "ulitsa Kostina, 3, Nizhny Novgorod",
  //     "name" : "Karamel'",
  //     "lng" : 43.99059800000001,
  //     "lat" : 56.311938,
  //     "updatedAt" : ISODate("2017-04-10T08:19:53.803Z")
  //   },
  //   {
  //     "_id" : ObjectId("58eb402a407bb511d1d395f5"),
  //     "google" : {
  //       "place_id" : "ChIJKwnxFrLVUUERDPhRUvwYtIA",
  //       "id" : "46cf2155045818a88ce2c65ce6749c1809c02a93",
  //       "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png"
  //     },
  //     "createdAt" : ISODate("2017-04-10T08:19:53.849Z"),
  //     "photo" : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
  //     "text" : "ulitsa Novaya, 29, Nizhny Novgorod",
  //     "name" : "Dezhavyu, Kafe, OOO",
  //     "lng" : 43.99272860000001,
  //     "lat" : 56.3130452,
  //     "updatedAt" : ISODate("2017-04-10T08:19:53.849Z")
  //   },
  //   {
  //     "_id" : ObjectId("58eb402a407bb511d1d395f6"),
  //     "google" : {
  //       "place_id" : "ChIJm9ra8rHVUUER1VeM_z-g9m8",
  //       "id" : "da32b63ab6bb0f5491432b6ad3ba97739624ed66",
  //       "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png"
  //     },
  //     "createdAt" : ISODate("2017-04-10T08:19:53.856Z"),
  //     "photo" : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
  //     "text" : "ulitsa Kostina, 3, Nizhny Novgorod",
  //     "name" : "Bufet Gurmana",
  //     "lng" : 43.9906706,
  //     "lat" : 56.3123324,
  //     "updatedAt" : ISODate("2017-04-10T08:19:53.856Z")
  //   }
  // ]


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
