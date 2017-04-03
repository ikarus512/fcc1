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
  testLog = require('./../my-test-log.js');



parallel('signup', function () {

  it('/signup should respond to GET',function(done){
    request
    .agent() // to make authenticated requests
    .get(appUrl+'/signup')
    .end(function(err, res){
      expect(err).to.not.exist;
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.text).to.contain('DynApps');
      expect(res.redirects).to.have.lengthOf(0); // no redirects
      done();
    });
  });

  it('/signup should respond to POST with error',function(done){
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/signup')
    .end(function(err, res){
      expect(err).to.exist;
      expect(res).to.exist;
      expect(res.status).to.equal(400);
      expect(res.text).to.equal('{"message":"Error: cannot POST /signup"}');
      expect(res.redirects).to.have.lengthOf(0); // no redirects
      done();
    });
  });



  it('/auth/local/signup good data should create new user',function(done){
    request
    .agent() // to make authenticated requests
    .post(appUrl+'/auth/local/signup')
    .send({username:'signup_a', password:'a', password2:'a'})
    .end(function(err, res){
      // testLog(res);

      expect(err).to.not.exist;
      expect(res.status).to.equal(200);

      var message = res.text.match(/<p class="alert alert-danger">[^>]+>/);
      expect(message).to.equal(null);

      expect(res.text).to.contain('DynApps');
      expect(res.text).to.contain('local / signup_a');
      expect(res.text).to.not.contain('Log In');
      expect(res.text).to.not.contain('Sign Up');

      // and should redirect to home
      expect(res.request.url).to.equal(appUrl+'/');
      expect(res.redirects).to.have.lengthOf(1);
      expect(res.redirects[0]).to.equal(appUrl+'/');

      done();
    });
  });


  var wrongData = [
    {                      msg:'Please fill in username.'},
    {username:1           ,msg:'Username can only contain -_alphanumeric characters.'},
    {username:''          ,msg:'Please fill in username.'},
    {username:'a'         ,msg:'Please fill in all fields as non-empty strings: username, password, password2.'},
    {username:'a',  password:1      ,msg:'Please fill in all fields as non-empty strings: username, password, password2.'},
    {username:'a',  password:''     ,msg:'Please fill in all fields as non-empty strings: username, password, password2.'},
    {username:'a',  password:'a'    ,msg:'Please fill in all fields as non-empty strings: username, password, password2.'},
    {username:'a',  password:'a', password2:1     ,msg:'Please fill in all fields as non-empty strings: username, password, password2.'},
    {username:'a',  password:'a', password2:''    ,msg:'Please fill in all fields as non-empty strings: username, password, password2.'},
    {username:'a',  password:'a', password2:'b'   ,msg:'Passwords do not match.'},
    {username:'a$', password:'a', password2:'a'   ,msg:'Username can only contain -_alphanumeric characters.'},
    {username:'a',  password:'a', password2:'a'   ,msg:'User a already exists.'},
  ];

  wrongData.forEach( function(data, idx) {

    it('/auth/local/signup wrong data should not be ok (idx='+idx+')',function(done){
      request
      .agent() // to make authenticated requests
      .post(appUrl+'/auth/local/signup').send(data)
      .end(function(err, res){
        expect(err).to.exist;
        expect(res.status).to.equal(400);

        var message = res.text.match(/<p class="alert alert-danger">[^>]+>/);
        expect(message).to.not.equal(null);
        expect(message[0]).to.contain(data.msg);

        done();
      });
    });

  });

});
