'use strict';

// Example: https://gist.github.com/joshbirk/1732068

var TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  GitHubStrategy = require('passport-github').Strategy,
  LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');


module.exports = function (passport) {

  passport.serializeUser(function (req, user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (req, id, done) {
    User.findOne({ '_id': id }, function (err, user) {
      if (err) {
        return done(err, false, req.flash( 'message', 'Error: user not found.' ) );
      }
      done(null, user);
    });
  });


  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback: true
    },
    function verify(req, username, password, done) {
      User.findOne({'local.username': username}, function(err, user) {
        if (err) { return done(err, false, req.flash( 'message', 'Internal error e0000003.' )); }
        if (!user) {
          return done(null, false, req.flash( 'message', 'Error: incorrect local user name.' ));
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash( 'message', 'Error: incorrect local user\'s password.' ));
        }
        return done(null, user);
      });
    }
  ));


  passport.use(new FacebookStrategy({
      clientID: process.env.APP_FACEBOOK_KEY,
      clientSecret: process.env.APP_FACEBOOK_SECRET,
      callbackURL: process.env.APP_URL + '/auth/facebook/callback'
    },
    function(/*access*/ token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
          if (err)  { return done(err, false, req.flash( 'message', 'Internal error e0000004.' )); }
          if (user) { return done(null, user); }

          var newUser = new User();
          newUser.facebook.id          = profile.id;
          // newUser.facebook.token       = profile.token;
          newUser.facebook.displayName = profile.displayName;
          newUser.facebook.username = profile.username;

          newUser.save(function (err) {
            if (err) { return done(err, false, req.flash( 'message', 'Internal error e0000006.' )); }
            return done(null, newUser);
          });
        });
      });
    }
  ));

  // Twitter
  // Docs: https://dev.twitter.com/docs --> my apps / create app
  // My apps: https://apps.twitter.com/app
  passport.use(new TwitterStrategy({
    consumerKey: process.env.APP_TWITTER_KEY,
    consumerSecret: process.env.APP_TWITTER_SECRET,
    callbackURL: process.env.APP_URL + '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'twitter.id': profile.id }, function (err, user) {
          if (err)  { return done(err, false, req.flash( 'message', 'Internal error e0000004.' )); }
          if (user) { return done(null, user); }

          var newUser = new User();
          newUser.twitter.id          = profile.id;
          //newUser.twitter.token       = token;
          newUser.twitter.username    = profile.username;
          newUser.twitter.displayName = profile.displayName;

          newUser.save(function (err) {
            if (err) { return done(err, false, req.flash( 'message', 'Internal error e0000006.' )); }
            return done(null, newUser);
          });
        });
      });
  }));



  passport.use(new GitHubStrategy({
      clientID: process.env.APP_GITHUB_KEY,
      clientSecret: process.env.APP_GITHUB_SECRET,
      callbackURL: process.env.APP_URL + '/auth/github/callback'
    },
    function (token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'github.id': profile.id }, function (err, user) {
          if (err)  { return done(err, false, req.flash( 'message', 'Internal error e0000005.' )); }
          if (user) { return done(null, user); }

          var newUser = new User();
          newUser.github.id = profile.id;
          newUser.github.username = profile.username;
          newUser.github.displayName = profile.displayName;
          //newUser.github.publicRepos = profile._json.public_repos;

          newUser.save(function (err) {
            if (err) { return done(err, false, req.flash( 'message', 'Internal error e0000007.' )); }
            return done(null, newUser);
          });
        });
      });
  }));

  return function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { return next(null); }

    // Remember curent url
    if (req.originalUrl.search(/^app\d_/)) {
      req.flash( 'savedUrl', req.originalUrl );
    }

    // And ask user to login
    res.redirect('/login')

  };

};
