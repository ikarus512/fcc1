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

var
    User = require('../models/users.js'),
    Promise = require('bluebird'),
    greet = require('../utils/greet.js'),
    PublicError = require('../utils/public-error.js'),
    myErrorLog = require('../utils/my-error-log.js'),
    myEnableCORS = require('../middleware/my-enable-cors.js'),
    rateLimitLogin = require('../middleware/security-rate-limit-login.js'),
    csrf = require('../middleware/security-csrf-protection.js');

module.exports = function (app, passport) {

    app.route('/login')
    .all(csrf.protection)
    .get(function(req, res) {
        if (req.isAuthenticated()) { /*istanbul ignore next*/ req.logout(); }

        var csrfToken = req.csrfToken();

        // res.locals.csrfToken = csrfToken;
        // xss(res.locals);

        res.render('login', greet(req, {
            flashmessage: req.flash('message')[0], // Display flash messages if any
            csrfToken: csrfToken
        }));
    });

    app.route('/signup')
    .all(csrf.protection)
    .get(function(req, res) {
        if (req.isAuthenticated()) { /*istanbul ignore next*/ req.logout(); }
        res.render('signup', greet(req, {csrfToken: req.csrfToken()}));
    });

    app.route('/logout')
    .get(function(req, res) {
        req.logout();
        res.redirect('/');
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////

    //
    //  Local Basic
    //

    app.route('/auth/local')
    .all(rateLimitLogin)
    .all(csrf.protection)
    .all(csrf.errHandler)
    .post(passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // REST cross origin login
    app.route('/auth/api/local')
    .all(rateLimitLogin)
    .all(myEnableCORS)
    .post(function(req, res, next) {
        // See https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
        // See http://passportjs.org/docs/login
        passport.authenticate('local-login', function(err, account, info) {
            // istanbul ignore next
            if (err) { // Here if internal error (no connection to users DB, etc.)
                // return next(err);
                return res.status(401).json({success: false, message: req.flash('message')[0]});
            }
            if (!account) { // istanbul ignore next
                return res.status(401).json({success: false, message: req.flash('message')[0]});
            }

            // "Note that when using a custom callback, it becomes the application's
            // responsibility to establish a session (by calling req.login()) and send
            // a response."           -- http://passportjs.org/docs/login
            req.logIn(account, function(loginErr) {
                if (loginErr) { // istanbul ignore next
                    // return next(loginErr);
                    return res.status(401).json({success: false, message: req.flash('message')[0]});
                }

                res.status(200)
                .json({
                    success: true,
                    type: account.type,
                    name: account.name,
                    uid: account._id
                });
            });
        })(req, res, next);
    });

    // REST: check if user logged in
    app.route('/auth/api/check')
    .all(myEnableCORS)
    .get(function(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.status(401)
            .json({message:'User not logged in.'});
        } else {
            return res.status(200)
            .json({
                type: req.user.type,
                name: req.user.name,
                uid: req.user._id
            });
        }
    });

    // Create new local user
    app.route('/auth/local/signup')
    .post(csrf.protection, function(req, res, next) {

        User.createLocalUser({
            username: req.body.username,
            password: req.body.password,
            password2: req.body.password2
        })

        .then(function(newUser) {
            // login as new user
            return new Promise(function(resolve, reject) {
                req.login(newUser, function(err) {
                    // istanbul ignore next
                    if (err) { throw new Error('Internal error e0000000.'); }
                    return resolve(res.redirect('/'));
                });
            });
        })

        // On any error, return back to signup page
        .catch(PublicError, function(err) {
            return res.status(400)
            .render('signup', greet(req, {
                lasterror: err.message,
                username: req.body.username
            }));
        })

        .catch(/*istanbul ignore next*/ function(err) {
            var message = 'Internal error e0000006.';
            myErrorLog(req, err, message);
            return res.status(500)
            .render('signup', greet(req, {
                lasterror: err.message,
                username: req.body.username
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
