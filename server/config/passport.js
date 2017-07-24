/* file: passport.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Passport.js Options
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

// Example: https://gist.github.com/joshbirk/1732068

var
    APPCONST = require('./../config/constants.js'),
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GitHubStrategy = require('passport-github').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    PublicError = require('../utils/public-error.js'),
    myErrorLog = require('../utils/my-error-log.js'),
    User = require('../models/users.js');

module.exports = function (passport) {

    passport.serializeUser(function(req, user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(req, id, done) {

        User.findOneMy({'_id': id})

        .then(function(user) {
            return done(null, user);
        })

        .catch(function(err) {
            var message = 'Internal error e0000001.';
            myErrorLog(req, err, message);
            return done(null, false, req.flash('message', message));
        });

    });

    passport.use('local-login', new LocalStrategy(
        {
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback: true
        },
        function localVerify(req, username, password, done) {

            var foundUser;

            User.findOneMy({'local.username': username})

            .then(function(user) {
                if (!user) { throw new PublicError('Incorrect local user name.'); }
                foundUser = user;
                return user.validatePassword(password);
            })

            .then(function(validated) {
                if (!validated) { throw new PublicError('Incorrect local user\'s password.'); }
                return done(null, foundUser);
            })

            .catch(PublicError, function(err) {
                return done(null, false, req.flash('message', err.message));
            })

            .catch(function(err) {
                var message = 'Internal error e0000002.';
                myErrorLog(req, err, message);
                return done(null, false, req.flash('message', message));
            });

        } // localVerify()
    ));

    passport.use(new FacebookStrategy(
        {
            clientID: APPCONST.env.APP_FACEBOOK_KEY,
            clientSecret: APPCONST.env.APP_FACEBOOK_SECRET,
            callbackURL: APPCONST.env.APP_URL + '/auth/facebook/callback',
            passReqToCallback: true
        },
        function facebookVerify(req, token, refreshToken, profile, done) {
            process.nextTick(function() {

                User.findOneMy({'facebook.id': profile.id})

                .then(function(user) {
                    if (user) { return user; } // if user found in database

                    // if user not found in database, add him there
                    var newUser = new User();
                    newUser.facebook.id          = profile.id;
                    // newUser.facebook.token       = profile.token;
                    newUser.facebook.displayName = profile.displayName;
                    newUser.facebook.username    = profile.username;

                    return newUser.save();
                })

                .then(function(user) {
                    return done(null, user);
                })

                .catch(function(err) {
                    var message = 'Internal error e0000003.';
                    myErrorLog(req, err, message);
                    return done(null, false, req.flash('message', message));
                });

            });
        } // facebookVerify()
    ));

    // Twitter
    // Docs: https://dev.twitter.com/docs --> my apps / create app
    // My apps: https://apps.twitter.com/app
    passport.use(new TwitterStrategy(
        {
            consumerKey: APPCONST.env.APP_TWITTER_KEY,
            consumerSecret: APPCONST.env.APP_TWITTER_SECRET,
            callbackURL: APPCONST.env.APP_URL + '/auth/twitter/callback',
            passReqToCallback: true
        },
        function twitterVerify(req, token, tokenSecret, profile, done) {
            process.nextTick(function() {

                User.findOneMy({'twitter.id': profile.id})

                .then(function(user) {
                    if (user) { return user; } // if user found in database

                    // if user not found in database, add him there
                    var newUser = new User();
                    newUser.twitter.id          = profile.id;
                    // newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    return newUser.save();
                })

                .then(function(user) {
                    return done(null, user);
                })

                .catch(function(err) {
                    var message = 'Internal error e0000004.';
                    myErrorLog(req, err, message);
                    return done(null, false, req.flash('message', message));
                });

            });
        } // twitterVerify()
    ));

    passport.use(new GitHubStrategy(
        {
            clientID: APPCONST.env.APP_GITHUB_KEY,
            clientSecret: APPCONST.env.APP_GITHUB_SECRET,
            callbackURL: APPCONST.env.APP_URL + '/auth/github/callback',
            passReqToCallback: true
        },
        function githubVerify(req, token, refreshToken, profile, done) {
            process.nextTick(function() {

                User.findOneMy({'github.id': profile.id})

                .then(function(user) {
                    if (user) { return user; } // if user found in database

                    // if user not found in database, add him there
                    var newUser = new User();
                    newUser.github.id          = profile.id;
                    newUser.github.username    = profile.username;
                    newUser.github.displayName = profile.displayName;
                    // newUser.github.publicRepos = profile._json.public_repos;

                    return newUser.save();
                })

                .then(function(user) {
                    return done(null, user);
                })

                .catch(function(err) {
                    var message = 'Internal error e0000005.';
                    myErrorLog(req, err, message);
                    return done(null, false, req.flash('message', message));
                });

            });
        } // githubVerify()
    ));

    return function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) { return next(null); }

        // Remember curent url
        if (req.originalUrl.search(/^app\d_/)) {
            req.flash('savedUrl', req.originalUrl);
        }

        // And ask user to login
        res.redirect('/login');

    };

};
