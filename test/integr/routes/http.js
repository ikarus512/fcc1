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



parallel('home', function(){

  it('http should redirect to https homepage',function(done){
    request
    .agent() // to make authenticated requests
    .get('http://localhost')
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res).to.exist;
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
    .get('http://localhost/login')
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res).to.exist;
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
    .post('http://localhost/login')
    .end(function(err, res){
      expect(err).to.exist;
      expect(res).to.exist;
      expect(res.status).to.equal(400);
      expect(res.redirects).to.have.lengthOf(0); // no redirects
      expect(res.text).to.equal('{"message":"Error: cannot POST http://localhost/login. Use https."}');
      done();
    });
  });

});
