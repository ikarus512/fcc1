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
    mongoose = require('mongoose'),
    mongoDb = require('mongodb'),

    dbInitTestApp1 = require('./db-init-test-app1.js'),
    // dbInitTestApp3 = require('./db-init-test-app3.js'),
    // dbInitTestApp4 = require('./db-init-test-app4.js'),
    // dbInitTestApp5 = require('./db-init-test-app5.js'),
    dbInitTestApp2 = require('./db-init-test-app2.js');

function dbInit(done) {

    var userA, userB, userU;

    //////////////////////////////////////////////////////////////
    // Clear DB:
    return new Promise(function(resolve) {
        return clearSessionsCollection(resolve);
    })

    .then(function() {
        return new Promise(function(resolve) {
            return clearDB(resolve);
        });
    })

    //////////////////////////////////////////////////////////////
    // Create users:
    //  local.username=admin, password=1234
    //  local.username=a, password=a
    //  local.username=b, password=b
    //  unauthorized.ip=x.x.x.y
    .then(function() {

        var promises = [

          User.createAdmin(),

          User.createLocalUser({username: 'a', password: 'a', password2: 'a'})
          .then(function(createdUser) { userA = createdUser; }),

          User.createLocalUser({username: 'b', password: 'b', password2: 'b'})
          .then(function(createdUser) { userB = createdUser; }),

          User.createUnauthorizedUser('x.x.x.y')
          .then(function(createdUser) { userU = createdUser; })

        ];

        return Promise.all(promises);

    })

    //////////////////////////////////////////////////////////////
    // App test data
    .then(function() {

        var promises = [
            dbInitTestApp1(userA, userB, userU),
            dbInitTestApp2()
            // dbInitTestApp3(),
            // dbInitTestApp4(),
            // dbInitTestApp5(),
        ];

        return Promise.all(promises);

    })

    .then(function() {
        return done();
    })

    .catch(function(err) {
        throw err;
    });
}

function clearSessionsCollection(callback) {
    var MongoClient = mongoDb.MongoClient;
    MongoClient.connect(dbUrl, function(err, db) {
        if (err) { throw err; }
        db.collection('sessions').remove({}, function(err, result) {
            if (err) { throw err; }
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
        for (i in mongoose.connection.collections) { val++; }
        for (i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(removeCallback);
        }

        function removeCallback() {
            val--; // (safe because no race condition in single-threaded node.js)
            if (val === 0) {
                if (callback) { return callback(); }
            }
            return;
        }
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(dbUrl, function (err) {
            if (err) { throw err; }
            clearDBLoop(callback);
        });
    } else {
        clearDBLoop(callback);
    }
}

module.exports = dbInit;
