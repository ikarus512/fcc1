/* file: app2.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App2 Routes
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var
    APPCONST = require('./../config/constants.js'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    greet = require(path.join(__dirname, '../utils/greet.js')),
    Cafe = require('./../models/app2-cafes.js'),
    PublicError = require('../utils/public-error.js'),
    getCafes = require('../utils/app2/get-cafes.js'),
    myErrorLog = require('../utils/my-error-log.js'),
    myEnableCORS = require('../middleware/my-enable-cors.js');

// GET /app2 - redirected to /app2/cafes
router.get('/', function(req, res) {
    res.redirect('/app2/cafes');
});

// GET /app2/cafes - view cafes
router.get('/cafes', function(req, res) {

    // Get user state from session, if any
    var app2state = {};

    if (req.session.app2state) {
        app2state.lat = req.session.app2state.lat;
        app2state.lng = req.session.app2state.lng;
        app2state.zoom = req.session.app2state.zoom;
        app2state.radius = req.session.app2state.radius;
        app2state.selectedCafeId = req.session.app2state.selectedCafeId;
    }

    res.render('app2_nightlife', greet(req, {
        app2state: app2state,
        APP_GOOGLE_MAPS_API_KEY: APPCONST.env.APP_GOOGLE_MAPS_API_KEY
    }));

});

////////////////////////////////////////////////////////////////////////////////////////////////////

// Enable CORS on selected REST API
router.all('/api/cafes', myEnableCORS);
router.all('/api/cafes/:cafeId/timeslots/:startTime/plan', myEnableCORS);
router.all('/api/cafes/:cafeId/timeslots/:startTime/unplan', myEnableCORS);

/**
 * @api {get} /app2/api/polls/user/:id Request User information
 * @apiName GetUser
 * @apiGroup app2
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
// RESTAPI GET    /app2/api/cafes?lat=DDD&lng=DDD&radius=DDD&zoom=DDD - get cafes
router.get('/api/cafes', function(req, res, next) { // eslint-disable-line complexity

    var radius = 188.796, lat = 56.312956, lng = 43.989955, zoom = 16; // Nizhny
    if (isFinite(Number(req.query.lat)))    { lat = Number(req.query.lat); }
    if (isFinite(Number(req.query.lng)))    { lng = Number(req.query.lng); }
    if (isFinite(Number(req.query.zoom)))   { zoom = Number(req.query.zoom); }
    if (isFinite(Number(req.query.radius))) { radius = Number(req.query.radius); }

    // Save user state to session
    req.session.app2state = req.session.app2state || {};
    req.session.app2state.lat = lat;
    req.session.app2state.lng = lng;
    req.session.app2state.zoom = zoom;
    req.session.app2state.radius = radius;
    req.session.app2state.selectedCafeId = req.query.selectedCafeId;

    var userId; if (req.user) { userId = req.user.id; }

    getCafes({userId: userId, lat:lat, lng:lng, radius:radius})

    .then(function(cafes) {
        res.status(200).json(cafes);
    })

    .catch(function(err) {
        myErrorLog(null, err);
        res.status(400).json([]);
    });

});

// RESTAPI PUT    /app2/api/cafes?lat=DDD&lng=DDD&radius=DDD&zoom=DDD - update session state
router.put('/api/cafes', function(req, res, next) {

    // Save user state to session
    if (isFinite(Number(req.query.lat)))    { req.session.app2state.lat = Number(req.query.lat); }
    if (isFinite(Number(req.query.lng)))    { req.session.app2state.lng = Number(req.query.lng); }
    if (isFinite(Number(req.query.zoom)))   { req.session.app2state.zoom = Number(req.query.zoom); }
    if (isFinite(Number(req.query.radius))) {
        req.session.app2state.radius = Number(req.query.radius);
    }
    if (req.query.selectedCafeId) {
        req.session.app2state.selectedCafeId = req.query.selectedCafeId;
    }

    res.status(200).json();

});

// RESTAPI PUT    /app2/api/cafes/:cafeId/timeslots/:startTime/plan - plan cafe timeslot
router.put('/api/cafes/:cafeId/timeslots/:startTime/plan', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Error: Only authorized person can plan cafe timeslot.'
        });
    }

    Cafe.planTimeslot({
        userId: req.user._id,
        cafeId: req.params.cafeId,
        startTime: new Date(decodeURIComponent(req.params.startTime))
    })

    // On success, send the response back
    .then(function() {
        return res.status(200).json();
    })

    // On fail, send error response
    .catch(PublicError, function(err) {
        return res.status(400).json({message:err.toString()});
    })

    // Internal error
    .catch(function(err) {
        var message = 'Internal error e0000007.';
        myErrorLog(req, err, message);
        return res.status(400).json({message:message});
    });

});

// RESTAPI PUT    /app2/api/cafes/:cafeId/timeslots/:startTime/unplan - unplan cafe timeslot
router.put('/api/cafes/:cafeId/timeslots/:startTime/unplan', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Error: Only authorized person can unplan cafe timeslot.'
        });
    }

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message:'Error: Only authorized person can plan cafe timeslot.'
        });
    }

    Cafe.unplanTimeslot({
        userId: req.user._id,
        cafeId: req.params.cafeId,
        startTime: new Date(decodeURIComponent(req.params.startTime))
    })

    // On success, send the response back
    .then(function() {
        return res.status(200).json();
    })

    // On fail, send error response
    .catch(PublicError, function(err) {
        return res.status(400).json({message:err.toString()});
    })

    // Internal error
    .catch(function(err) {
        var message = 'Internal error e0000007.';
        myErrorLog(req, err, message);
        return res.status(400).json({message:message});
    });

});

module.exports = router;
