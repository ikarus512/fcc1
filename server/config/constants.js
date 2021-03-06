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
    isHeroku = require('./../utils/is-heroku.js'),
    PORT = process.env.PORT || /*istanbul ignore next*/ 5000;

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

APPCONST = {

    // max size of cafes collection:
    APP2_MAX_CAFES: (isHeroku() ? /*istanbul ignore next*/ 100000 : 100),
    APP2_GOOGLE_SEARCH_ENABLED: isHeroku(),
    // APP2_GOOGLE_SEARCH_ENABLED: true,
    APP2_MAX_TIMESLOTS: 4,
    APP2_TIMESLOT_LENGTH: 30, // timeslot length in minutes (must divide 60)
    APP2_MAPS_SEARCH_LIMIT: 15, // max number of cafes to return in response to one search request

    APP3_STOCK_PORTION_LENGTH: 5,

    // WISH: move it to APPENV.APP_URL etc
    env: {
        APP_URL: process.env.APP_URL || 'https://127.0.0.1:' + PORT,
        APP_MONGODB_URI: process.env.APP_MONGODB_URI || (// production
            process.env.NODE_ENV === 'test' ?
            'mongodb://localhost:27017/test' : // test
            /*istanbul ignore next*/
            'mongodb://localhost:27017/dbname' // development
        ),

        PORT: PORT,
        PORT_HTTP: process.env.PORT_HTTP || /*istanbul ignore next*/ 80,
        NODE_ENV: process.env.NODE_ENV || /*istanbul ignore next*/ 'production',

        APP_FACEBOOK_KEY: process.env.APP_FACEBOOK_KEY || '1111111111111111',
        APP_FACEBOOK_SECRET: process.env.APP_FACEBOOK_SECRET || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        APP_TWITTER_KEY: process.env.APP_TWITTER_KEY || 'AAAAAAAAAAAAAAAAAAAAAAAAA',
        APP_TWITTER_SECRET: process.env.APP_TWITTER_SECRET ||
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        APP_GITHUB_KEY: process.env.APP_GITHUB_KEY || 'aaaaaaaaaaaaaaaaaaaa',
        APP_GITHUB_SECRET: process.env.APP_GITHUB_SECRET ||
            '1111111111111111111111111111111111111111',

        APP_GOOGLE_MAPS_API_KEY: process.env.APP_GOOGLE_MAPS_API_KEY ||
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',

        APP_GOOGLE_PLACES_API_KEY: process.env.APP_GOOGLE_PLACES_API_KEY ||
            'AAAAAAAAAAAAAAAA-AAAAAAAAAAAAAAAAAAAA-w',
        APP_GOOGLE_PLACES_API_REFERRER: process.env.APP_GOOGLE_PLACES_API_REFERRER ||
            '1111111111111111111111'

    } // env: {...}

};

module.exports = APPCONST;
