/* file: session-options.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Session Options
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

module.exports = function(session) {
  var dbUrl = require('./../config/db-url.js');

  var MongoStore = require('connect-mongo')(session);

  var sessionOptions = {
    secret: 'Yoursecret key7651894',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: dbUrl }),
  };

  return sessionOptions;
};
