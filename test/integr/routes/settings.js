/* file: settings.js */
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

parallel('route settings', function() {

    //==========================================================
    //  settings page
    //==========================================================
    it('for unauth user should respond to GET', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/settings')
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res).to.not.equal(null);
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('DynApps');
            expect(res.request.url).to.equal(appUrl + '/login');
            expect(res.redirects).to.have.lengthOf(1);
            expect(res.redirects[0]).to.equal(appUrl + '/login');
            done();
        });
    });

    it('for auth user should respond to GET', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/settings')
        .set('Cookie', data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res).to.not.equal(null);
            expect(res.status).to.equal(200);
            expect(res.text).to.contain('DynApps');
            expect(res.redirects).to.have.lengthOf(0); // no redirects
            done();
        });
    });

    it('should respond to POST with error', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/settings')
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res).to.not.equal(null);
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('{"message":"Error: cannot POST /settings"}');
            expect(res.redirects).to.have.lengthOf(0); // no redirects
            done();
        });
    });

});
