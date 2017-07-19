/* file: settings.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Settings Route
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var User = require('../models/users.js'),
  PublicError = require('../utils/public-error.js'),
  myErrorLog = require('../utils/my-error-log.js');

module.exports = function (app, passport, isLoggedIn, greet) {

    // /settings route (protected)
    app.route('/settings')
    .get(isLoggedIn, function (req, res) {
        res.render('settings', greet(req));
    });

    // GET /settings/api/users/:id
    app.route('/settings/api/users/:id')
    .get(function (req, res) {

        var uid;
        if (req.isAuthenticated()) { uid = req.user._id; }

        // Find user settings, if id equals uid
        User.getSettings(req.params.id, uid)

        // Send the response back
        .then(function(user) {
            return res.status(200).json(user);
        })

        // On fail, send error response
        .catch(PublicError, function(err) {
            return res.status(400).json({message:err.toString()});
        })

        // Internal error
        .catch(function(err) {
            var message = 'Internal error e000000e.';
            myErrorLog(null, err, message);
            return res.status(400).json({message: message});
        });

    });

    // DELETE /settings/api/users/:id
    app.route('/settings/api/users/:id')
    .delete(function (req, res) {

        var uid;
        if (req.isAuthenticated()) { uid = req.user._id; }

        // Find user settings, if id equals uid
        User.removeUser(req.params.id, uid)

        // Send the response back
        .then(function(user) {
            return res.status(200).json(user);
        })

        // On fail, send error response
        .catch(PublicError, function(err) {
            return res.status(400).json({message:err.toString()});
        })

        // Internal error
        .catch(function(err) {
            var message = 'Internal error e000000f.';
            myErrorLog(null, err, message);
            return res.status(400).json({message: message});
        });

    });

    // POST /settings/api/users/:id
    app.route('/settings/api/users/:id')
    .post(function (req, res) {

        var uid;
        if (req.isAuthenticated()) { uid = req.user._id; }

        // Find user settings, if id equals uid
        User.updateSettings(req.params.id, uid, req.body)

        // Send the response back
        .then(function(user) {
            return res.status(200).json(user);
        })

        // On fail, send error response
        .catch(PublicError, function(err) {
            return res.status(400).json({message:err.toString()});
        })

        // Internal error
        .catch(function(err) {
            var message = 'Internal error e0000010.';
            myErrorLog(null, err, message);
            return res.status(400).json({message: message});
        });

    });

};
