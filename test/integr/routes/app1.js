'use strict';

require('./../test-utils.js');

var
  request = require('superagent'),
  chai = require('chai'),
  expect = chai.expect,
  should = chai.should,
  parallel = require('mocha.parallel'),
  // parallel = describe,
  appUrl = require('./../../../server/config/app-url.js'),
  testLog = require('./../my-test-log.js'),

  Poll = require('../../../server/models/polls'),
  poll_id;



before( function () {
  return Poll.findOne({}).exec()
  .then(function(poll){
    if (!poll) throw Error('Polls not found.');
    poll_id = poll._id;
  });
});


var userACookies;

before( function(done) {
  // Log in as user a, and get cookie with session id
  request
  .agent() // to make authenticated requests
  .post(appUrl+'/auth/local')
  .send({username:'a', password:'a'})
  .end(function(err, res){
    // testLog(res);
    userACookies = res.request.cookies;

    expect(err).to.not.exist;
    expect(res.status).to.equal(200);

    expect(res.text).to.contain('local / a');

    // and should redirect to home
    expect(res.request.url).to.equal(appUrl+'/');
    done();
  });
});


parallel('app1', function () {

  it('unauth user should be able to view polls', function (done) {
    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1')
    .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
    .end(function(err, res){

      expect(err).to.not.exist;
      expect(res.status).to.equal(200);

      expect(res.text).to.not.contain('local / a');

      // and should redirect to home
      expect(res.request.url).to.equal(appUrl+'/app1/polls');
      expect(res.redirects).to.have.lengthOf(1);
      expect(res.redirects[0]).to.equal(appUrl+'/app1/polls');

      done();
    });
  });

  it('unauth user should be able to view poll details', function (done) {

    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1/polls/'+poll_id)
    .set('X-Forwarded-For','x.x.x.y') // make server detect user ip from this header
    .end(function(err, res){

      expect(err).to.not.exist;
      expect(res.status).to.equal(200);

      expect(res.text).to.not.contain('local / a');

      // and should redirect to home
      expect(res.request.url).to.equal(appUrl+'/app1/polls/'+poll_id);
      expect(res.redirects).to.have.lengthOf(0);

      done();
    });

  });






  it('auth user should be able to view polls', function (done) {

    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1')
    .set('Cookie', userACookies) // authorize user a
    .end(function(err, res){

      expect(err).to.not.exist;
      expect(res.status).to.equal(200);

      expect(res.text).to.contain('local / a');

      // and should redirect to home
      expect(res.request.url).to.equal(appUrl+'/app1/polls');
      expect(res.redirects).to.have.lengthOf(1);
      expect(res.redirects[0]).to.equal(appUrl+'/app1/polls');

      done();
    });

  });

  it('auth user should be able to view poll details', function (done) {

    request
    .agent() // to make authenticated requests
    .get(appUrl+'/app1/polls/'+poll_id)
    .set('Cookie', userACookies) // authorize user a
    .end(function(err, res){

      expect(err).to.not.exist;
      expect(res.status).to.equal(200);

      expect(res.text).to.contain('local / a');

      // and should redirect to home
      expect(res.request.url).to.equal(appUrl+'/app1/polls/'+poll_id);
      expect(res.redirects).to.have.lengthOf(0);

      done();
    });

  });

});
