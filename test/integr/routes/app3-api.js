/* file: app3-api.js */
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

    app3Data,
    initApp3Data = require('./../init-app3.js');

before(function() {
    return initApp3Data()
    .then(function(res) {
        app3Data = res;
        return undefined;
    });
});

parallel('app3-api', function() {

    //==========================================================
    //  unauth user
    //==========================================================
    it('unauth user should not get ws ticket', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app3/api/get-ws-ticket')
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            expect(res.body.error).to.equal('Unauthorized');
            done();
        });
    });

    //==========================================================
    //  auth user
    //==========================================================
    it('auth user should get ws ticket', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app3/api/get-ws-ticket')
        .set('Cookie', app3Data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.ticket).to.not.equal(undefined);
            done();
        });
    });

});
