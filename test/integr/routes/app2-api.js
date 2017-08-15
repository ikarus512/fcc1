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

    // 'auth user should add himself to a cafe plans'
    // 'auth user should remove himself from cafe plans'

    // it('auth user should add cafe', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .post(appUrl + '/app2/api/cafes')
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({title: userANewCafeTitle})
    //     .end(function(err, res) {
    //         expect(err).to.equal(null);
    //         expect(res.status).to.equal(200);
    //         done();
    //     });
    // });

    // it('auth user should not add existing cafe', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .post(appUrl + '/app2/api/cafes')
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({title: app2Data.titles[2]})
    //     .end(function(err, res) {
    //         expect(err).to.not.equal(null);
    //         expect(res.status).to.equal(404);
    //         expect(res.text).to.contain('Error: cafe with this title alredy exists.');
    //         done();
    //     });
    // });

    // it('auth user should delete his cafe', function(done) {
    //     // Add cafe 4
    //     request
    //     .agent() // to make authenticated requests
    //     .post(appUrl + '/app2/api/cafes')
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({title: 'cafe 4'})
    //     .end(function(err, res) {
    //         expect(err).to.equal(null);
    //         expect(res.status).to.equal(200);

    //         var cafe4 = res.body;

    //         // Delete cafe 4
    //         request
    //         .agent() // to make authenticated requests
    //         .delete(appUrl + '/app2/api/cafes/' + cafe4._id)
    //         .set('Cookie', app2Data.users.userACookies) // authorize user a
    //         .send({})
    //         .end(function(err, res) {
    //             expect(err).to.equal(null);
    //             expect(res.status).to.equal(200);
    //             done();
    //         });
    //     });
    // });

    // it('auth user should not delete other\'s cafe', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .delete(appUrl + '/app2/api/cafes/' + app2Data.cafes[3]._id)
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({})
    //     .end(function(err, res) {
    //         // testLog({res:res,err:err});
    //         expect(err).to.not.equal(null);
    //         expect(res.status).to.equal(404);
    //         expect(res.text).to.contain(
    //             'Error: Only cafe creator and local admin can remove the cafe.'
    //         );
    //         done();
    //     });
    // });

    // it('auth user should view cafe', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .get(appUrl + '/app2/api/cafes/' + app2Data.cafes[2]._id)
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({})
    //     .end(function(err, res) {
    //         expect(err).to.equal(null);
    //         expect(res.status).to.equal(200);
    //         expect(res.body.title).to.equal(app2Data.titles[2]);
    //         done();
    //     });
    // });

    // it('auth user should add cafe option', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .post(appUrl + '/app2/api/cafes/' + app2Data.cafes[0]._id + '/options')
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({title: 'Option 3.2'})
    //     .end(function(err, res) {
    //         expect(err).to.equal(null);
    //         expect(res.status).to.equal(200);
    //         done();
    //     });
    // });

    // it('auth user should not add existing cafe option', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .post(appUrl + '/app2/api/cafes/' + app2Data.cafes[2]._id + '/options')
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({title: 'Option 1'})
    //     .end(function(err, res) {
    //         expect(err).to.not.equal(null);
    //         expect(res.status).to.equal(404);
    //         expect(res.text).to.contain('Error: Option with this title already exists.');
    //         done();
    //     });
    // });

    // it('auth user should vote', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .put(appUrl + '/app2/api/cafes/' + app2Data.cafes[0]._id +
    //         '/options/' + app2Data.cafes[0].options[0]._id + '/vote'
    //     )
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({})
    //     .end(function(err, res) {
    //         expect(err).to.equal(null);
    //         expect(res.status).to.equal(200);
    //         done();
    //     });
    // });

    // it('auth user should not vote twice', function(done) {
    //     request
    //     .agent() // to make authenticated requests
    //     .put(appUrl + '/app2/api/cafes/' + app2Data.cafes[3]._id +
    //         '/options/' + app2Data.cafes[3].options[0]._id + '/vote'
    //     )
    //     .set('Cookie', app2Data.users.userACookies) // authorize user a
    //     .send({})
    //     .end(function(err, res) {
    //         expect(err).to.not.equal(null);
    //         expect(res.status).to.equal(404);
    //         expect(res.text).to.contain('Error: You already voted in this cafe for Option 1.');
    //         done();
    //     });
    // });

});
