/* file: test-utils.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Integration/Coverage Test Utils
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

// process.env.NODE_ENV = 'test';
// process.env.PORT = 5000;
// process.env.PORT_HTTP = 8000;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Ignore 'self-signed certificate' error

var server = require('./../../server/index.js');

before(function(done) {
    server.boot(done);
});

after(function(done) {
    server.shutdown(done);
});
