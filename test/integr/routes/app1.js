/* file: app1.js */
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

    initApp1Data = require('./../init-app1.js'),
    app1Data,
    pollId,
    pollIdInexistent;

before(function() {
    return initApp1Data()
    .then(function(res) {
        app1Data = res;
        pollId = app1Data.polls[0]._id;
        pollIdInexistent = pollId + 'aaa';
        return undefined;
    });
});

parallel('app1', function() {

    it('unauth user should be able to view polls', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1')
        .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
        .then(function(res) {
            expect(res.status).to.equal(200);

            expect(res.text).to.not.contain('local / a');

            // and should redirect
            expect(res.request.url).to.equal(appUrl + '/app1/polls');
            expect(res.redirects).to.have.lengthOf(1);
            expect(res.redirects[0]).to.equal(appUrl + '/app1/polls');
        });
    });

    it('unauth user should be able to view poll details', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/polls/' + pollId)
        .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
        .then(function(res) {
            expect(res.status).to.equal(200);

            expect(res.text).to.not.contain('local / a');

            // and should redirect
            expect(res.request.url).to.equal(appUrl + '/app1/polls/' + pollId);
            expect(res.redirects).to.have.lengthOf(0);
        });

    });

    it('auth user should be able to view polls', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .then(function(res) {
            expect(res.status).to.equal(200);

            expect(res.text).to.contain('local / a');

            // and should redirect
            expect(res.request.url).to.equal(appUrl + '/app1/polls');
            expect(res.redirects).to.have.lengthOf(1);
            expect(res.redirects[0]).to.equal(appUrl + '/app1/polls');
        });

    });

    it('auth user should be able to view poll details', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/polls/' + pollId)
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .then(function(res) {
            expect(res.status).to.equal(200);

            expect(res.text).to.contain('local / a');

            // and should not redirect
            expect(res.request.url).to.equal(appUrl + '/app1/polls/' + pollId);
            expect(res.redirects).to.have.lengthOf(0);
        });

    });

    it('auth user should not view inexsistent poll', function() {
        return request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/polls/' + pollIdInexistent)
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .then(function(res) {
            throw new Error('This test branch is not expected');
        })
        .catch(function(err) {
            expect(err).to.not.equal(null);
            expect(err.response.status).to.equal(404);
            // and should not redirect
            expect(err.response.request.url).to.equal(appUrl + '/app1/polls/' + pollIdInexistent);
            expect(err.response.redirects).to.have.lengthOf(0);
        });

    });

});
