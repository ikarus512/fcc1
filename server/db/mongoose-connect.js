'use strict';

// Mongoose connection to DB.
// Stops http/s server when DB connection error.

var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  createAdmin = require('./create-admin.js');

mongoose.Promise = Promise;



module.exports = function () {

  mongoose.connect(process.env.APP_MONGODB_URI, function(){
    createAdmin();
  });

};
