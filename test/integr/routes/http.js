/* file: http.js */
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

var
  appHttpUrl = 'http:'+appUrl.replace(/https:/,'').replace(/\:.*$/,'');


parallel('http', function(){

  it('should redirect to https homepage',function(done){
    request
    .agent() // to make authenticated requests
    .get(appHttpUrl)
    .end(function(err, res){
      expect(err).to.equal(null);
      expect(res).to.not.equal(null);
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('DynApps');
      expect(res.request.url).to.equal(appUrl+'/');
      expect(res.redirects).to.have.lengthOf(1);
      expect(res.redirects[0]).to.equal(appUrl+'/');
      done();
    });
  });


  it('anypage should redirect to https homepage',function(done){
    request
    .agent() // to make authenticated requests
    .get(appHttpUrl+'/login')
    .end(function(err, res){
      expect(err).to.equal(null);
      expect(res).to.not.equal(null);
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('DynApps');
      expect(res.request.url).to.equal(appUrl+'/');
      expect(res.redirects.length).to.equal(1);
      expect(res.redirects[0]).to.equal(appUrl+'/');
      done();
    });
  });

  it('anypage should respond to POST with error',function(done){
    request
    .agent() // to make authenticated requests
    .post(appHttpUrl+'/login')
    .end(function(err, res){
      expect(err).to.not.equal(null);
      expect(res).to.not.equal(null);
      expect(res.status).to.equal(400);
      expect(res.redirects).to.have.lengthOf(0); // no redirects
      expect(res.text).to.equal('{"message":"Error: cannot POST '+appHttpUrl+'/login. Use https."}');
      done();
    });
  });

});
