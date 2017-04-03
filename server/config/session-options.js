'use strict';

var dbUrl = require('./../config/db-url.js');

module.exports = function(session) {
  var MongoStore = require('connect-mongo')(session);

  var sessionOptions = {
    secret: "Yoursecret key7651894",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: dbUrl }),
  };

  return sessionOptions;
};
