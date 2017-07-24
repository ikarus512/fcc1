/* file: logout.js */
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
    testLog = require('./../my-test-log.js');

var userACookies;

before(function(done) {
    // Log in as user a, and get cookie with session id
    request
    .agent() // to make authenticated requests
    .post(appUrl + '/auth/local')
    .send({username:'a', password:'a'})
    .end(function(err, res) {
        testLog({res:res,err:err});
        userACookies = res.request.cookies;

        expect(err).to.equal(null);
        expect(res.status).to.equal(200);

        expect(res.text).to.contain('local / a');

        // and should redirect to home
        expect(res.request.url).to.equal(appUrl + '/');
        done();
    });
});

parallel('/logout', function () {

    it('should work', function(done) {

        request
        .agent() // to make authenticated requests
        .get(appUrl + '/logout')
        .set('Cookie', userACookies) // authorize user a
        .end(function(err, res) {

            expect(err).to.equal(null);
            expect(res.status).to.equal(200);

            expect(res.text).to.not.contain('local / a');

            // and should redirect to home
            expect(res.request.url).to.equal(appUrl + '/');
            expect(res.redirects).to.have.lengthOf(1);
            expect(res.redirects[0]).to.equal(appUrl + '/');

            done();
        });

    });

});
