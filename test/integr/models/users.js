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

  User = require('../../../server/models/users');


parallel('model User', function () {

  it('admin should exist', function (done) {

    User.findOneMy({'local.username': 'admin'})

    .then(function(user){
      expect(user).to.exist;
      expect(user.local).to.exist;
      expect(user.local.username).to.equal('admin');
      expect(user.local.password).to.exist;
      return user.validatePassword('1234')
    })

    .then(function(validated){
      expect(validated).to.equal(true);
      return done();
    })

    .catch(function(err){
      return done(err);
    });

  });

  it('#save() should create a new User', function (done) {
    User.generateHash('pass')
    .then(function(pwdHash){
      var u = new User();
      u.local = { username: 'model_user_me', password: pwdHash };
      return u.save();
    })
    .then(function(user){
      expect(user).to.exist;
      expect(user.local).to.exist;
      expect(user.local.username).to.equal('model_user_me');
      expect(user.local.password).to.exist;
      return user.validatePassword('pass')
    })
    .then(function(validated){
      expect(validated).to.equal(true);
      return done();
    })
    .catch(function(err){
      return done(err);
    });
  });

});
