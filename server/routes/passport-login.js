'use strict';

// Example: https://gist.github.com/joshbirk/1732068

var User = require('../models/users'),
  Promise = require('bluebird'),
  PublicError = require('../utils/public-error.js'),
  myErrorLog = require('../utils/my-error-log.js');

module.exports = function (app, passport) {

  app.route('/login')
  .get(function (req, res) {
    res.render('login', {
      flashmessage: req.flash('message')[0] // Display flash messages if any
    });
  });

  app.route('/signup')
  .get(function (req, res) {
    res.render('signup', {});
  });

  app.route('/logout')
  .get(function (req, res) {
    req.logout();
    res.redirect('/');
  });



  //
  //  Local Basic
  //
  app.route('/auth/local')
  .post( passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // Create new local user
  app.route('/auth/local/signup')
  .post( function(req, res, next) {

    new Promise(function(resolve, reject) {

      if (!req.body.username) // if username absent
        throw new PublicError('Please fill in username.');

      if (typeof(req.body.username)!=='string'
      || !req.body.username.match(/^(\w|\d|\-)+$/))
        throw new PublicError('Username can only contain -_alphanumeric characters.');

      if (typeof(req.body.password)!=='string'
      || typeof(req.body.password2)!=='string'
      || !req.body.password || !req.body.password2)
        throw new PublicError('Please fill in all fields as strings: username, password, password2.');

      return resolve();
    })

    .then(function() {
      // first, check if user already exists.
      return User.findOneMy({ 'local.username': req.body.username });
    })

    .then(function(user) {
      if (user) // if user exists
        throw new PublicError('Such user already exists!');

      // local user not found, we can try to create it

      if (req.body.password !== req.body.password2)
        throw new PublicError('Passwords do not match!');

      // first, generate password hash
      return User.generateHash(req.body.password);
    })

    .then(function(pwd_hash) {
      // create new user with this password hash
      var newUser = new User();
      newUser.local.username = req.body.username;
      newUser.local.password = pwd_hash;
      return newUser.save();
    })

    .then(function(newUser) {
      // login as new user
      return req.login(newUser, function(err) {
        if (err) throw new Error('Internal error e0000000.');
        return res.redirect('/');
      });
    })

    // On any error, return back to signup page
    .catch( PublicError, function(err) {
      return res.render('signup', {lasterror: err.message, username: req.body.username});
    })

    .catch( function(err) {
      myErrorLog(req, err);
      return res.render('signup', {lasterror: 'Internal error e0000006.', username: req.body.username});
    });

  });

  //
  //  Twitter
  //
  app.route('/auth/twitter')
  .get(passport.authenticate('twitter'));

  app.route('/auth/twitter/callback')
  .get(passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  //
  //  Facebook
  //
  app.route('/auth/facebook')
  .get(passport.authenticate('facebook'));

  app.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  //
  //  GitHub
  //
  app.route('/auth/github')
  .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
  .get(passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

};
