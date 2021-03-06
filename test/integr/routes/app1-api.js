/* file: app1-api.js */
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
    pollIdInexistent,
        // Tests here will change only app1Data.polls[0] as follows:
        // - userU: vote
        // - userA: add option, vote
    titlePref = 'test/integr/routes/app1-api.js',
    userANewPollTitle = titlePref + ' auth user should add poll';

before(function() {
    return initApp1Data()
    .then(function(res) {
        app1Data = res;

        pollIdInexistent = app1Data.polls[0]._id + 'aaa';
        return undefined;
    });
});

parallel('app1-api', function() {

    //==========================================================
    //  unauth user
    //==========================================================
    it('unauth user should view polls', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/api/polls')
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.length).to.be.at.least(app1Data.polls.length);
            expect(res.body).to.include.deep.members([app1Data.polls[1]]);
            expect(res.body).to.include.deep.members([app1Data.polls[2]]);
            expect(res.body).to.include.deep.members([app1Data.polls[3]]);
            done();
        });
    });

    it('unauth user should not add poll', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls')
        .send({title: titlePref + ' unauth user should not add poll'})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            expect(res.text).to.contain('Error: Only authorized person can create new poll.');
            done();
        });
    });

    it('unauth user should not delete any poll', function(done) {
        request
        .agent() // to make authenticated requests
        .delete(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id)
        .send({})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            expect(res.text).to.contain('Error: Only authorized person can delete the poll.');
            done();
        });
    });

    it('unauth user should view poll', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id)
        .send({})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(app1Data.titles[0]);
            done();
        });
    });

    it('unauth user should not view inexistent poll', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/api/polls/' + pollIdInexistent)
        .send({})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            done();
        });
    });

    it('unauth user should not add poll option', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id + '/options')
        .send({title: 'Option 3.1'})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            expect(res.text).to.contain('Error: Only authorized person can add poll options.');
            done();
        });
    });

    it('unauth user should not add existing poll option', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id + '/options')
        .send({title: 'Option 1'})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(401);
            expect(res.text).to.contain('Error: Only authorized person can add poll options.');
            done();
        });
    });

    it('unauth user should vote', function(done) {
        request
        .agent() // to make authenticated requests
        .put(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id +
            '/options/' + app1Data.polls[0].options[0]._id + '/vote'
        )
        .send({})
        .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('unauth user should not vote twice', function(done) {
        request
        .agent() // to make authenticated requests
        .put(appUrl + '/app1/api/polls/' + app1Data.polls[1]._id +
            '/options/' + app1Data.polls[1].options[0]._id + '/vote'
        )
        .send({})
        .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            expect(res.text).to.contain('Error: You already voted in this poll for Option 2.');
            done();
        });
    });

    //==========================================================
    //  auth user
    //==========================================================
    it('auth user should view polls', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/api/polls')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.length).to.be.at.least(app1Data.polls.length);
            expect(res.body).to.include.deep.members([app1Data.polls[1]]);
            expect(res.body).to.include.deep.members([app1Data.polls[2]]);
            expect(res.body).to.include.deep.members([app1Data.polls[3]]);
            done();
        });
    });

    it('auth user should add poll', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({title: userANewPollTitle})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('auth user should not add existing poll', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({title: app1Data.titles[2]})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            expect(res.text).to.contain('Error: Poll with this title alredy exists.');
            done();
        });
    });

    it('auth user should delete his poll', function(done) {
        // Add Poll 4
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({title: 'Poll 4'})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);

            var poll4 = res.body;

            // Delete Poll 4
            request
            .agent() // to make authenticated requests
            .delete(appUrl + '/app1/api/polls/' + poll4._id)
            .set('Cookie', app1Data.users.userACookies) // authorize user a
            .send({})
            .end(function(err, res) {
                expect(err).to.equal(null);
                expect(res.status).to.equal(200);
                done();
            });
        });
    });

    it('auth user should not delete other\'s poll', function(done) {
        request
        .agent() // to make authenticated requests
        .delete(appUrl + '/app1/api/polls/' + app1Data.polls[3]._id)
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({})
        .end(function(err, res) {
            // testLog({res:res,err:err});
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            expect(res.text).to.contain(
                'Error: Only poll creator and local admin can remove the poll.'
            );
            done();
        });
    });

    it('auth user should view poll', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/api/polls/' + app1Data.polls[2]._id)
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(app1Data.titles[2]);
            done();
        });
    });

    it('auth user should not view inexistent poll', function(done) {
        request
        .agent() // to make authenticated requests
        .get(appUrl + '/app1/api/polls/' + pollIdInexistent)
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            done();
        });
    });

    it('auth user should add poll option', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id + '/options')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({title: 'Option 3.2'})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('auth user should not add existing poll option', function(done) {
        request
        .agent() // to make authenticated requests
        .post(appUrl + '/app1/api/polls/' + app1Data.polls[2]._id + '/options')
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({title: 'Option 1'})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            expect(res.text).to.contain('Error: Option with this title already exists.');
            done();
        });
    });

    it('auth user should vote', function(done) {
        request
        .agent() // to make authenticated requests
        .put(appUrl + '/app1/api/polls/' + app1Data.polls[0]._id +
            '/options/' + app1Data.polls[0].options[0]._id + '/vote'
        )
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({})
        .end(function(err, res) {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            done();
        });
    });

    it('auth user should not vote twice', function(done) {
        request
        .agent() // to make authenticated requests
        .put(appUrl + '/app1/api/polls/' + app1Data.polls[3]._id +
            '/options/' + app1Data.polls[3].options[0]._id + '/vote'
        )
        .set('Cookie', app1Data.users.userACookies) // authorize user a
        .send({})
        .end(function(err, res) {
            expect(err).to.not.equal(null);
            expect(res.status).to.equal(404);
            expect(res.text).to.contain('Error: You already voted in this poll for Option 1.');
            done();
        });
    });

});
