/* file: app5.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION:
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

require('./../test-utils.js');

var
    request = require('superagent'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should,
    // parallel = require('mocha.parallel'),
    // parallel = describe,
    parallel = (process.env.RUNNING_UNDER_ISTANBUL) ? describe : require('mocha.parallel'),
    appUrl = require('./../../../server/config/app-url.js'),
    testLog = require('./../my-test-log.js'),

    initApp5Data = require('./../init-app5.js'),
    app5Data;

before(function() {
    return initApp5Data()
    .then(function(res) {
        app5Data = res;
        return undefined;
    });
});

parallel('app5', function() {

    it('unauth user should view items', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app5')
        .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
        .then(function(res) {
            expect(res.status).to.equal(200);

            expect(res.text).to.not.contain('local / a');

            // and should redirect to home
            expect(res.request.url).to.equal(appUrl + '/app5');
        });
    });

    it('auth user should view items', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app5')
        .set('Cookie', app5Data.users.userACookies) // authorize user a
        .then(function(res) {
            expect(res.status).to.equal(200);

            expect(res.text).to.contain('local / a');

            // and should redirect to home
            expect(res.request.url).to.equal(appUrl + '/app5');
        });

    });

});
