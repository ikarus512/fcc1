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

module.exports = function(boot, shutdown) {

  var
    dbUrl       = require('./../server/config/db-url.js'),
    mongoose    = require('mongoose');

  before( function(done) {
    boot(
    clearSessionsCollection.bind(null,
    clearDB.bind(null,
    done)));
  });

  after( function(done) {
    shutdown(done);
    // clearSessionsCollection();
    // clearDB();
  });

  function clearSessionsCollection(callback) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(dbUrl, function(err, db) {
      if (err) throw err;
      db.collection('sessions').remove({},function(err, result) {
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

};
