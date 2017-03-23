'use strict';

// Example: https://gist.github.com/joshbirk/1732068

var User = require('../models/users');

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
  .post( passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // Create new local user
  app.route('/auth/local/signup')
  .post( function(req, res, next) {

    // Check if username present
    if (!req.body.username) {
      return res.render('signup', { lasterror: 'Error: please fill in username.' });
    }

    // Check if username is correct
    if (typeof(req.body.username)!=='string' || !req.body.username.match(/^(\w|\d)*$/)) {
      return res.render('signup', {
        lasterror: "Error: username can only contain _alphanumeric characters.",
        username: req.body.username
      });
    }

    // Check if all parameters present and are correct
    if (!req.body.password || !req.body.password2) {
      return res.render('signup', {
        lasterror: 'Error: please fill in all fields: username, password, password2.',
        username: req.body.username
      });
    }

    // Check if user already exists
    User.findOne({ 'local.username': req.body.username }, function (err, user) {

      if (err) {
        return res.render('signup', {lasterror:'Internal error e0000000.'});
      }

      if (user) {
        return res.render('signup', {
          lasterror: 'Error: user already exists!',
          username: req.body.username
        });
      }

      if (req.body.password !== req.body.password2) {
        return res.render('signup', {
          lasterror: 'Error: passwords do not match!',
          username: req.body.username
        });
      }

      // Local user not found. Create it.
      var newUser = new User();
      newUser.type = 'local';
      newUser.local.username = req.body.username;
      newUser.local.password = req.body.password;

      newUser.save(function (err) {
        if (err) {
          return res.render('signup', {
            lasterror: 'Internal error e000001.',
            username: req.body.username
          });
        }

        // Login as new user
        req.login(newUser, function(err) {
          if (err) {
            return res.render('signup', { lasterror: 'Internal error e0000002.' });
          }

          return res.redirect('/');

        });
      });
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
