/* file: security-headers-common.js */
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

    // (OFF by default)
    // // Sets Expect-CT: enforce; max-age=30; report-uri="http://example.com/report"
    // app.use(expectCt({
    //   enforce: true,
    //   maxAge: 30,
    //   reportUri: require('../config/app-url.js') + '/report'
    // }));

    // (ON by default)
    // Sets "X-DNS-Prefetch-Control: off".
    app.use(helmet.dnsPrefetchControl());

    // (ON by default)
    // Sets "X-Frame-Options: DENY".
    app.use(helmet.frameguard({action: 'deny'}));

    // (ON by default)
    // A lie in the header x-powered-by
    app.use(helmet.hidePoweredBy({setTo: 'PHP 4.2.0'}));

    // (OFF by default)
    // var ninetyDaysInSeconds = 7776000;
    // app.use(helmet.hpkp({
    //   maxAge: ninetyDaysInSeconds,
    //   sha256s: ['AbCdEf123=', 'ZyXwVu456=']
    // }));

    // (ON by default)
    // Sets "Strict-Transport-Security: max-age=5184000; includeSubDomains".
    var sixtyDaysInSeconds = 5184000;
    app.use(helmet.hsts({
        maxAge: sixtyDaysInSeconds,
        includeSubDomains: true,
        preload: true,
    }));

    // (ON by default)
    // Sets "X-Download-Options: noopen".
    app.use(helmet.ieNoOpen());

    // (OFF by default)
    // // Sets headers: Cache-Control, Surrogate-Control, Pragma, and Expires
    // app.use(helmet.noCache());

    // (ON by default)
    // Sets "X-Content-Type-Options: nosniff".
    app.use(helmet.noSniff());

    // (OFF by default)
    // // Sets "Referrer-Policy: same-origin".
    // app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

    // (ON by default)
    // Sets "X-XSS-Protection: 1; mode=block".
    app.use(helmet.xssFilter());

};
