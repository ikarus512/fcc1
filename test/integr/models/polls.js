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

  Poll = require('../../../server/models/polls');


describe('model Poll', function () {

  it('#save() should create a new poll', function (done) {
    var poll = new Poll();
    poll.title = 'Poll title';
    poll.save(poll, function (err, createdPoll) {
      expect(err).to.not.exist;
      expect(createdPoll).to.exist;
      expect(createdPoll.title).to.equal('Poll title');
      done();
    });
  });

});
