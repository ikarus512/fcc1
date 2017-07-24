/* file: security-headers-https-csp.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Security Related Headers Settings
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
    helmet = require('helmet'); // https://helmetjs.github.io/docs

module.exports = function (app) {

    // (OFF by default)
    // app.use(helmet.contentSecurityPolicy({
    //   directives: {
    //     defaultSrc: ["'self'"],
    //     // styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
    //   }
    // }));

};
