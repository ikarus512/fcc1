'use strict';

// Mongoose connection to DB.
// Stops http/s server when DB connection error.

var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  createAdmin = require('./../models/create-admin.js'),
  dbUrl = require('./../config/db-url.js');

mongoose.Promise = Promise;



module.exports = function () {

  mongoose.connect(dbUrl, function(){
    createAdmin();
  });

};
