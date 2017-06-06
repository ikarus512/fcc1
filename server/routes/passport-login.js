/* file: passport-login.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Passport.js Login-Related Routes
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *  2017/06/02, ikarus512. Enable CORS.
 *
 */

/*jshint node: true*/
'use strict';

// Example: https://gist.github.com/joshbirk/1732068

var User = require('../models/users.js'),
  Promise = require('bluebird'),
  greet = require('../utils/greet.js'),
  PublicError = require('../utils/public-error.js'),
  myErrorLog = require('../utils/my-error-log.js'),
  myEnableCORS = require('../middleware/my-enable-cors.js');

module.exports = function (app, passport) {

  app.route('/login')
  .get( function(req, res) {
    if(req.isAuthenticated()) req.logout();
    res.render('login', greet(req, {
      flashmessage: req.flash('message')[0] // Display flash messages if any
    }));
  });

  app.route('/signup')
  .get( function(req, res) {
    if(req.isAuthenticated()) req.logout();
    res.render('signup', greet(req));
  });

  app.route('/logout')
  .get( function(req, res) {
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

  // REST cross origin login
  app.route('/auth/api/local')
  .all(myEnableCORS)
  .post( function(req, res, next) {
    passport.authenticate('local-login', function (err, account) {
      req.logIn(account, function() {
        res.status(err ? 500 : 200)
        .json(err ? err : account.local.username);
      });
    })(req, res, next);
  });

  // Create new local user
  app.route('/auth/local/signup')
  .post( function(req, res, next) {

    User.createLocalUser({
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
    })

    .then( function(newUser) {
      // login as new user
      return new Promise( function(resolve, reject) {
        req.login(newUser, function(err) {
          if (err) throw new Error('Internal error e0000000.');
          return resolve(res.redirect('/'));
        });
      });
    })

    // On any error, return back to signup page
    .catch( PublicError, function(err) {
      return res.status(400)
      .render('signup', greet(req, {
        lasterror: err.message,
        username: req.body.username,
      }));
    })

    .catch( function(err) {
      var message = 'Internal error e0000006.';
      myErrorLog(req, err, message);
      return res.status(500)
      .render('signup', greet(req, {
        lasterror: err.message,
        username: req.body.username,
      }));
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
