/* file: login.js */
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
  parallel = (process.env.running_under_istanbul) ? describe : require('mocha.parallel'),
  appUrl = require('./../../../server/config/app-url.js'),
  testLog = require('./../my-test-log.js');

parallel('login', function() {

  it('/login should allow GET', function() {

    return request
    .agent() // to make authenticated requests
    .get(appUrl+'/login')
    .then( function(res) {
      expect(res.status).to.equal(200);

      var message = res.text.match(/<p class="alert alert-danger">[^>]+>/);
      expect(message).to.equal(null);

      expect(res.text).to.contain('DynApps');
      expect(res.text).to.not.contain('local / admin');
      expect(res.text).to.contain('Log In');
      expect(res.text).to.contain('Sign Up');

      // and should not redirect
      expect(res.request.url).to.equal(appUrl+'/login');
      expect(res.redirects).to.have.lengthOf(0);
    });

  });

  it('/login should not allow POST', function() {

    return request
    .agent() // to make authenticated requests
    .post(appUrl+'/login')
    .then( function(res) {
      throw new Error("Not expected");
    })
    .catch( function(err) {
      expect(err).to.not.equal(null);
      expect(err.status).to.not.equal(200);
    });

  });


  it('/auth/local should allow correct login', function() {
    return request
    .agent() // to make authenticated requests
    .post(appUrl+'/auth/local')
    .send({username:'admin', password:'1234'})
    .then( function(res) {
      expect(res.status).to.equal(200);

      var message = res.text.match(/<p class="alert alert-danger">[^>]+>/);
      expect(message).to.equal(null);

      expect(res.text).to.contain('DynApps');
      expect(res.text).to.contain('local / admin');
      expect(res.text).to.not.contain('Log In');
      expect(res.text).to.not.contain('Sign Up');

      // and should redirect to home
      expect(res.request.url).to.equal(appUrl+'/');
      expect(res.redirects).to.have.lengthOf(1);
      expect(res.redirects[0]).to.equal(appUrl+'/');
    });

  });

  var wrongData = [
    {username:'admi-', password:'1234', msg:'Incorrect local user name.'},
    {username:'admin', password:'123-', msg:'Incorrect local user\'s password.'},
  ];

  wrongData.forEach( function(data, idx) {

    it('/auth/local should not allow incorrect login (idx='+idx+')', function() {
      return request
      .agent() // to make authenticated requests
      .post(appUrl+'/auth/local')

      .send({username:data.username, password:data.password})
      .then( function(res) {

        expect(res.status).to.equal(200);

        var message = res.text.match(/<p class="alert alert-danger">[^>]+>/);
        expect(message).to.not.equal(null);
        expect(message[0]).to.contain(data.msg);

        expect(res.text).to.contain('DynApps');
        expect(res.text).to.not.contain('local / admin');
        expect(res.text).to.contain('Log In');
        expect(res.text).to.contain('Sign Up');

        // and should redirect to /login page
        expect(res.request.url).to.equal(appUrl+'/login');
        expect(res.redirects).to.have.lengthOf(1);
        expect(res.redirects[0]).to.equal(appUrl+'/login');

      });

    });

  });

});
