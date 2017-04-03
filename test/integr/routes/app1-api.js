'use strict';

require('./../test-utils.js');

var
  request = require('superagent'),
  chai = require('chai'),
  expect = chai.expect,
  should = chai.should,
  // parallel = require('mocha.parallel'),
  // parallel = describe,
  parallel = (process.env.running_under_istanbul) ? describe : require('mocha.parallel'),
  appUrl = require('./../../../server/config/app-url.js'),
  testLog = require('./../my-test-log.js'),

  Poll = require('../../../server/models/polls'),
  User = require('../../../server/models/users'),
  user,
  user2,
  unonimous;

// Get Poll 1, Poll 2

var poll0, poll1;

before( function () {
  return Poll.findOne({title: 'Poll 1'}).exec()
  .then( function(poll) {
    if (!poll) throw Error('Poll 1 not found.');
    poll0 = poll;
    return Poll.findOne({title: 'Poll 2'}).exec()
  })
  .then( function(poll) {
    if (!poll) throw Error('Poll 2 not found.');
    poll1 = poll;
  });
});

// Get session id cookie of user a

var userACookies;

before( function(done) {
  // Log in as user a, and get cookie with session id
  request
  .agent() // to make authenticated requests
  .post(appUrl+'/auth/local')
  .send({username:'a', password:'a'})
  .end(function(err, res){
    userACookies = res.request.cookies;

    expect(err).to.not.exist;
    expect(res.status).to.equal(200);

    expect(res.text).to.contain('local / a');

    // and should redirect to home
    expect(res.request.url).to.equal(appUrl+'/');
    done();
  });
});


parallel('app1 api', function () {

  //==========================================================
  //  unauth user
  //==========================================================
  it('unauth user should view polls', function (done) {
    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1/api/polls')
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      expect(res.body.length).to.be.above(1); // at least 2 polls
      expect(res.body[0].title).to.equal(poll0.title); // Poll 1
      expect(res.body[1].title).to.equal(poll1.title); // Poll 2
      done();
    });
  });

  it('unauth user should not add poll', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls')
    .send({title: 'Poll 3'})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(401);
      expect(res.text).to.contain('Error: Only authorized person can create new poll.');
      done();
    });
  });

  it('unauth user should not delete other\'s poll', function (done) {
    request
    .agent() // to make authenticated requests
    .delete(appUrl+'/app1/api/polls/'+poll0._id)
    .send({})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(401);
      expect(res.text).to.contain('Error: Only authorized person can delete the poll.');
      done();
    });
  });

  it('unauth user should view poll', function (done) {
    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1/api/polls/'+poll0._id)
    .send({})
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Poll 1');
      done();
    });
  });

  it('unauth user should not add poll option', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls/'+poll0._id+'/options')
    .send({title: 'Option 3'})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(401);
      expect(res.text).to.contain('Error: Only authorized person can add poll options.');
      done();
    });
  });

  it('unauth user should not add existing poll option', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls/'+poll0._id+'/options')
    .send({title: 'Option 1'})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(401);
      expect(res.text).to.contain('Error: Only authorized person can add poll options.');
      done();
    });
  });

  it('unauth user should vote', function (done) {
    request
    .agent() // to make authenticated requests
    .put(appUrl+'/app1/api/polls/'+poll0._id+'/options/'+poll0.options[0]._id+'/vote')
    .send({})
    .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      done();
    });
  });

  it('unauth user should not vote twice', function (done) {
    request
    .agent() // to make authenticated requests
    .put(appUrl+'/app1/api/polls/'+poll1._id+'/options/'+poll1.options[0]._id+'/vote')
    .send({})
    .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(400);
      expect(res.text).to.contain('Error: You already voted in this poll for Option 2.');
      done();
    });
  });


  //==========================================================
  //  auth user
  //==========================================================
  it('auth user should view polls', function (done) {
    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1/api/polls')
    .set('Cookie', userACookies) // authorize user a
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      expect(res.body.length).to.be.above(1); // at least 2 polls
      expect(res.body[0].title).to.equal(poll0.title); // Poll 1
      expect(res.body[1].title).to.equal(poll1.title); // Poll 2
      done();
    });
  });

  it('auth user should add poll', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls')
    .set('Cookie', userACookies) // authorize user a
    .send({title: 'Poll 3'})
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      done();
    });
  });

  it('auth user should not add existing poll', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls')
    .set('Cookie', userACookies) // authorize user a
    .send({title: 'Poll 1'})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(400);
      expect(res.text).to.contain('Error: Poll with this title alredy exists.');
      done();
    });
  });

  it('auth user should delete his poll', function (done) {
    // Add Poll 4
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls')
    .set('Cookie', userACookies) // authorize user a
    .send({title: 'Poll 4'})
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);

      var poll4 = res.body;

      // Delete Poll 4
      request
      .agent() // to make authenticated requests
      .delete(appUrl+'/app1/api/polls/'+poll4._id)
      .set('Cookie', userACookies) // authorize user a
      .send({})
      .end(function(err, res){
        expect(err).to.not.exist;
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  it('auth user should not delete other\'s poll', function (done) {
    request
    .agent() // to make authenticated requests
    .delete(appUrl+'/app1/api/polls/'+poll1._id)
    .set('Cookie', userACookies) // authorize user a
    .send({})
    .end(function(err, res){
      // testLog(res);
      expect(err).to.exist;
      expect(res.status).to.equal(400);
      expect(res.text).to.contain('Error: Only poll creator and local admin can remove the poll.');
      done();
    });
  });

  it('auth user should view poll', function (done) {
    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1/api/polls/'+poll0._id)
    .set('Cookie', userACookies) // authorize user a
    .send({})
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Poll 1');
      done();
    });
  });

  it('auth user should add poll option', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls/'+poll0._id+'/options')
    .set('Cookie', userACookies) // authorize user a
    .send({title: 'Option 3'})
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      done();
    });
  });

  it('auth user should not add existing poll option', function (done) {
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/app1/api/polls/'+poll0._id+'/options')
    .set('Cookie', userACookies) // authorize user a
    .send({title: 'Option 1'})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(400);
      expect(res.text).to.contain('Error: Option with this title already exists.');
      done();
    });
  });

  it('auth user should vote', function (done) {
    request
    .agent() // to make authenticated requests
    .put(appUrl+'/app1/api/polls/'+poll0._id+'/options/'+poll0.options[0]._id+'/vote')
    .set('Cookie', userACookies) // authorize user a
    .send({})
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res.status).to.equal(200);
      done();
    });
  });

  it('auth user should not vote twice', function (done) {
    request
    .agent() // to make authenticated requests
    .put(appUrl+'/app1/api/polls/'+poll1._id+'/options/'+poll1.options[0]._id+'/vote')
    .set('Cookie', userACookies) // authorize user a
    .send({})
    .end(function(err, res){
      expect(err).to.exist;
      expect(res.status).to.equal(400);
      expect(res.text).to.contain('Error: You already voted in this poll for Option 1.');
      done();
    });
  });

});
