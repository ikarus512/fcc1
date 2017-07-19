/* file: users.js */
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
  testLog = require('./../my-test-log.js'),

  User = require('../../../server/models/users.js');

parallel('model User', function () {

    it('admin should exist', function (done) {

        User.findOneMy({'local.username': 'admin'})

        .then(function(user) {
            expect(user).to.not.equal(null);
            expect(user.local).to.not.equal(null);
            expect(user.local.username).to.equal('admin');
            expect(user.local.password).to.not.equal(null);
            return user.validatePassword('1234');
        })

        .then(function(validated) {
            expect(validated).to.equal(true);
            return done();
        })

        .catch(function(err) {
            return done(err);
        });

    });

    it('#save() should create a new User', function (done) {
        User.generateHash('pass')
        .then(function(pwdHash) {
            var u = new User();
            u.local = {username: 'model_user_me', password: pwdHash};
            return u.save();
        })
        .then(function(user) {
            expect(user).to.not.equal(null);
            expect(user.local).to.not.equal(null);
            expect(user.local.username).to.equal('model_user_me');
            expect(user.local.password).to.not.equal(null);
            return user.validatePassword('pass');
        })
        .then(function(validated) {
            expect(validated).to.equal(true);
            return done();
        })
        .catch(function(err) {
            return done(err);
        });
    });

});
