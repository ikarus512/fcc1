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

var
    dbUrl = require('./../config/db-url.js');

module.exports = function(session) {

    var
        MongoStore = require('connect-mongo')(session),

        sessionOptions = {
            secret: 'Yoursecret key7651894', // Unsecure to keep it here:)
            //                                  ... But Ok for education purposes.

            resave: false,
            saveUninitialized: true,
            store: new MongoStore({url: dbUrl}),

            name: 'cookNm',
            cookie: {
                httpOnly: true,  // dont let browser javascript access cookie ever
                secure: true, // only use cookie over https
                // domain: 'example.com',
                path: '/',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }
        };

    return sessionOptions;
};
