/* file: app2-api.js */
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

    // Tests here will change only app2Data.cafes[0] as follows:
    // - userA: plan
    // - userA: unplan
    app2Data,
    APPCONST = require('./../../../server/config/constants.js'),
    initApp2Data = require('./../init-app2.js');

before(function() {
    return initApp2Data()
    .then(function(res) {
        app2Data = res;
        return undefined;
    });
});

parallel('app2-api', function() {

    //==========================================================
    //  unauth user
    //==========================================================
    it('unauth user should view cafes', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app2/api/cafes?lat=56.312956&lng=43.989955&radius=188.796&zoom=16')
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);

            expect(res.body.length).to.be.at.least(Math.min(
                APPCONST.APP2_MAPS_SEARCH_LIMIT,
                app2Data.cafes.length
            ));

            expect(res.body).to.include.deep.members([app2Data.cafes[1]]);
            expect(res.body).to.include.deep.members([app2Data.cafes[2]]);
            expect(res.body).to.include.deep.members([app2Data.cafes[3]]);

            done();
        });
    });

    it('unauth user should update his session state', function(done) {
        request
        .agent() // to make authenticated requests
        .put(appUrl + '/app2/api/cafes')
        .send({
            lat: 56.312956,
            lng: 43.989955,
            radius: 188.796,
            zoom: 16
            // selectedCafeId: undefined
        })
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('auth user should add himself to a cafe plans', function(done) {
        var start = new Date();
        start.setMinutes(
            Math.floor(start.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
            APPCONST.APP2_TIMESLOT_LENGTH + 5
        );

        request
        .agent() // to make authenticated requests
        .put(appUrl +
            '/app2/api/cafes/' +
            app2Data.cafes[0]._id +
            '/timeslots/' +
            start +
            '/plan'
        )
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            done();
        });
    });

    //==========================================================
    //  auth user
    //==========================================================
    it('auth user should view cafes', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app2/api/cafes?lat=56.312956&lng=43.989955&radius=188.796&zoom=16')
        .set('Cookie', app2Data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);

            expect(res.body.length).to.be.at.least(Math.min(
                APPCONST.APP2_MAPS_SEARCH_LIMIT,
                app2Data.cafes.length
            ));

            expect(res.body).to.include.deep.members([app2Data.cafes[1]]);
            expect(res.body).to.include.deep.members([app2Data.cafes[2]]);
            expect(res.body).to.include.deep.members([app2Data.cafes[3]]);

            done();
        });
    });

    it('auth user should update his session state', function(done) {
        request
        .agent() // to make authenticated requests
        .put(appUrl + '/app2/api/cafes')
        .set('Cookie', app2Data.users.userACookies) // authorize user a
        .send({
            lat: 56.312956,
            lng: 43.989955,
            radius: 188.796,
            zoom: 16
            // selectedCafeId: undefined
        })
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('auth user can plan to attend cafe, not plan 2 times, can unplan', function(done) {
        var start = new Date();
        start.setMinutes(
            Math.floor(start.getMinutes() / APPCONST.APP2_TIMESLOT_LENGTH) *
            APPCONST.APP2_TIMESLOT_LENGTH + 5
        );

        request.agent().put(appUrl +
            '/app2/api/cafes/' +
            app2Data.cafes[0]._id +
            '/timeslots/' +
            start +
            '/plan'
        )
        .set('Cookie', app2Data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);

            request.agent().put(appUrl +
                '/app2/api/cafes/' +
                app2Data.cafes[0]._id +
                '/timeslots/' +
                start +
                '/plan'
            )
            .set('Cookie', app2Data.users.userACookies) // authorize user a
            .end(function(err, res) {
                expect(err).to.not.equal(null);
                expect(res.body.error).to.equal('Not Found');
                expect(res.body.message).to.equal(
                    'PublicError: You already planned this timeslot.');
                expect(res.status).to.equal(404);

                request.agent().put(appUrl +
                    '/app2/api/cafes/' +
                    app2Data.cafes[0]._id +
                    '/timeslots/' +
                    start +
                    '/unplan'
                )
                .set('Cookie', app2Data.users.userACookies) // authorize user a
                .end(function(err, res) {
                    expect(err).to.equal(null);
                    expect(res.status).to.equal(200);

                    done();
                });
            });
        });
    });

});
