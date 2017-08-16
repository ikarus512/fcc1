/* file: statmon.js */
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

    initData = require('./../init-settings-page.js'),
    data;

before(function() {
    return initData()
    .then(function(res) {
        data = res;
        return undefined;
    });
});

parallel('route statmon', function() {

    //==========================================================
    //  statmon page
    //==========================================================
    it('unauth user should not view statmon', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/statmon')
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res).to.not.equal(null);
            expect(res.status).to.equal(200);
            // expect(res.text).to.contain('DynApps');
            // expect(res.request.url).to.equal(appUrl + '/statmon');
            // expect(res.redirects).to.have.lengthOf(1);
            // expect(res.redirects[0]).to.equal(appUrl + '/login');
            done();
        });
    });

    it('auth non-admin user should not view statmon', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/statmon')
        .set('Cookie', data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res).to.not.equal(null);
            expect(res.status).to.equal(200);
            // expect(res.text).to.contain('DynApps');
            // expect(res.redirects).to.have.lengthOf(0); // no redirects
            done();
        });
    });

    it('admin should view statmon', function(done) {

        request
        .agent() // to make authenticated requests
        .post(appUrl + '/auth/local')
        .send({username:'admin', password:'1234'})
        .end(function(err, res) {
            var userAdminCookies = res.request.cookies; // Get session id cookie for admin

            expect(err).to.equal(null);
            expect(res).to.not.equal(null);
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('DynApps');

            expect(res.request.url).to.equal(appUrl + '/');
            expect(res.redirects).to.have.lengthOf(1);
            expect(res.redirects[0]).to.equal(appUrl + '/');

            request
            .agent() // to make authenticated requests
            .get(appUrl + '/statmon')
            .set('Cookie', userAdminCookies) // authorize as admin
            .end(function(err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                expect(res.status).to.equal(200);
                expect(res.redirects).to.have.lengthOf(0); // no redirects
                done();
            });
        });
    });

    it('should respond to POST with error', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/statmon')
        .end(function(err, res) {
            // expect(err).to.not.equal(null);
            expect(res).to.not.equal(null);
            // expect(res.status).to.equal(400);
            // expect(res.text).to.equal('{"message":"Error: cannot POST /statmon"}');
            // expect(res.redirects).to.have.lengthOf(0); // no redirects
            done();
        });
    });

});
