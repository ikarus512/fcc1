/* file: polls.js */
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

  Poll = require('../../../server/models/polls');


describe('model Poll', function () {

  it('#save() should create a new poll', function (done) {
    var poll = new Poll();
    poll.title = 'Poll title';
    poll.save(poll, function (err, createdPoll) {
      expect(err).to.equal(null);
      expect(createdPoll).to.not.equal(null);
      expect(createdPoll.title).to.equal('Poll title');
      done();
    });
  });

});
