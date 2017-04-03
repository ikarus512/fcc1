'use strict';

module.exports = function(session) {
  var dbUrl = require('./../config/db-url.js');

  var MongoStore = require('connect-mongo')(session);

  var sessionOptions = {
    secret: "Yoursecret key7651894",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: dbUrl }),
  };

  return sessionOptions;
};
