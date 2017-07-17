/* file: constants.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Application Constants
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *  2017/04/13, ikarus512. Google APIs enabled only on Heroku.
 *
 */

/*jshint node: true*/
'use strict';

var
  APPCONST,
  isHeroku = require('./../utils/is-heroku.js');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

APPCONST = {
  APP2_MAX_CAFES: (isHeroku() ? 100000 : 100), // max size of cafes collection
  //APP2_GOOGLE_SEARCH_ENABLED: isHeroku(),
    APP2_GOOGLE_SEARCH_ENABLED: true,
  APP2_MAX_TIMESLOTS: 4,
  APP2_TIMESLOT_LENGTH: 30, // timeslot length in minutes (must divide 60)

  APP3_STOCK_PORTION_LENGTH: 5,

  env: {
    APP_URL: process.env.APP_URL || 'https://127.0.0.1:5000',
    APP_MONGODB_URI: process.env.APP_MONGODB_URI || 'mongodb://localhost:27017/dbname',

    PORT: process.env.PORT || 5000,
    PORT_HTTP: process.env.PORT_HTTP || 80,
    NODE_ENV: process.env.NODE_ENV || 'production',

    APP_FACEBOOK_KEY: process.env.APP_FACEBOOK_KEY || '1111111111111111',
    APP_FACEBOOK_SECRET: process.env.APP_FACEBOOK_SECRET || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    APP_TWITTER_KEY: process.env.APP_TWITTER_KEY || 'AAAAAAAAAAAAAAAAAAAAAAAAA',
    APP_TWITTER_SECRET: process.env.APP_TWITTER_SECRET ||
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    APP_GITHUB_KEY: process.env.APP_GITHUB_KEY || 'aaaaaaaaaaaaaaaaaaaa',
    APP_GITHUB_SECRET: process.env.APP_GITHUB_SECRET || '1111111111111111111111111111111111111111',
  },
};

module.exports = APPCONST;
