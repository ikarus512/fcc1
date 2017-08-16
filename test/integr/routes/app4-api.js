/* file: app4-api.js */
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

    app4Data,
    initApp4Data = require('./../init-app4.js');

before(function() {
    return initApp4Data()
    .then(function(res) {
        app4Data = res;
        return undefined;
    });
});

parallel('app4-api', function() {

    //==========================================================
    //  unauth user
    //==========================================================
    it('unauth user should view books', function(done) {
        request.agent()
        .get(appUrl + '/app4/api/books')
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    // WISH: move it to login-api.js test
    it('unauth user should be able to login via api', function(done) {
        request.agent()
        .post(appUrl + '/auth/api/local')
        .send({username:'a', password:'a'})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    // WISH: move it to login-api.js test
    it('unauth user should be able to check if he is logged in, via api', function(done) {
        request.agent()
        .get(appUrl + '/auth/api/check')
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            done();
        });
    });

    // WISH: move it to login-api.js test
    it('auth user should be able to check if he is logged in, via api', function(done) {
        request.agent()
        .get(appUrl + '/auth/api/check')
        .set('Cookie', app4Data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    //==========================================================
    //  auth user
    //==========================================================
    it('auth user should view books', function(done) {
        request.agent()
        .get(appUrl + '/app4/api/books')
        .set('Cookie', app4Data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

});
