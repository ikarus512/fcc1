/* file: init-users-sessions.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Apps Users Initializations
 * AUTHOR: ikarus512
 * CREATED: 2017/07/18
 *
 * MODIFICATION HISTORY
 *  2017/07/18, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var
    request = require('superagent'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should,
    // parallel = require('mocha.parallel'),
    // parallel = describe,
    parallel = (process.env.RUNNING_UNDER_ISTANBUL) ? describe : require('mocha.parallel'),
    appUrl = require('./../../server/config/app-url.js'),
    testLog = require('./my-test-log.js'),

    // cheerio = require('cheerio'),
    // extractCsrfToken = function extractCsrfToken_(res) {
    //     var $ = cheerio.load(res.text);
    //     return $('[name=_csrf]').val();
    // },

    Promise = require('bluebird'),
    result = undefined;

function initUsersSessions(users) {

    //////////////////////////////////////////////////////////////
    // Create users sessions and return their cookies:
    //  users.userACookies == session id cookie for user a
    //  return users;

    if (result) {
        return Promise.resolve(result);
    }

    return new Promise(function(resolve, reject) {
        //   request
        //   .agent() // to make authenticated requests
        //   .get(appUrl+'/login')
        //   .end(function(err, res) {
        //     // this is the route which renders the HTML form that
        //     // asks for our username and password. Let’s retrieve
        //     // the token from that form:
        //     var csrfToken = extractCsrfToken(res);
        //     expect(err).to.equal(null);
        //     expect(res.status).to.equal(200);

        // Log in as user a, and get cookie with session id
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/auth/local')
        .send({username:'a', password:'a'})
        // .send({username:'a', password:'a', _csrf: csrfToken})
        .then(function(res) {
            users.userACookies = res.request.cookies; // Get session id cookie for user a
            expect(res.status).to.equal(200);

            expect(res.text).to.contain('local / a');

            // and should redirect to home
            expect(res.request.url).to.equal(appUrl + '/');

            result = users;
            resolve(result);
        })
        .catch(function(err) {
            reject(err);
        });
        // });

    });

}

module.exports = initUsersSessions;
