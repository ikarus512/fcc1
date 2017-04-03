'use strict';

// Mongoose connect with automatic reconnection to DB.
// Does not stop http/s server when DB disconnected.
// Connection can be checked by if(mongoose.connection.readyState).

var
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  createAdmin = require('./../models/create-admin.js'),
  MANUAL_RECONNECT_INTERVAL = 30, // seconds
  dbUrl = require('./../config/db-url.js');

mongoose.Promise = Promise;



function connect() {
  mongoose.connect(dbUrl, {
    server: {
      auto_reconnect: true,
      reconnectTries: 3,
      reconnectInterval: 1*1000,
    }
  });
};


function exitHandler(options, err) {
  if (options.exit) process.exit();
}


module.exports = function () {

  connect();

  mongoose.connection.on('error', function(){});

  mongoose.connection.on('disconnected', function(){
    console.log('DB disconnected '+ new Date().toISOString() +': absent or lost MongoDB connection...');
    setTimeout(function(){ connect(); }, MANUAL_RECONNECT_INTERVAL*1000);
  });

  mongoose.connection.on('connected', function() {
    console.log('DB connected '+ new Date().toISOString() +': Connection established to MongoDB');
    createAdmin();
  });

  //catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));

};
