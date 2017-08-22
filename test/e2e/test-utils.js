/* file: test-utils.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: E2E Test Utils
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
/*global by, browser, element */
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

afterEach(function() {
    var
        chai = require('chai').use(require('chai-as-promised')),
        expect = chai.expect;

    // Browser console should not have errors
    browser.manage().logs().get('browser').then(function(browserLog) {
        if (!process.env.MOBILE_APP_TEST) {
            // // Uncomment to actually see the log:
            // console.log('log: ' + require('util').inspect(browserLog));
            expect(browserLog.length).to.equal(0);
        }
    });
});

if (process.env.MOBILE_APP_TEST) {
    before(function(done) {
        var opts = {
            // root: 'mobile/fcc1apps',
            root: '../../mobile/fcc1apps/platforms/browser/www',
            port: 5006,
            noLogOutput: true
        };
        var serve = require('cordova-serve')();
        serve.launchServer(opts);
        serve.servePlatform('browser', opts);
        // serve.launchBrowser(opts);
        setTimeout(function() {done();}, 5000);
        // browser.pause(); // webDriver debug
    });
}
