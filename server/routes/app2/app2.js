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
    APPCONST = require('../../config/constants.js'),
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    greet = require(path.join(__dirname, '../../utils/greet.js')),
    Cafe = require('../../models/app2-cafes.js'),
    PublicError = require('../../utils/public-error.js'),
    getCafes = require('../../utils/app2/get-cafes.js'),
    myErrorLog = require('../../utils/my-error-log.js'),
    myEnableCORS = require('../../middleware/my-enable-cors.js');

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
    } else {
        var radius = 188.796, lat = 56.312956, lng = 43.989955, zoom = 16; // Nizhny
        app2state.lat = lat;
        app2state.lng = lng;
        app2state.zoom = zoom;
        app2state.radius = radius;
        app2state.selectedCafeId = 'undefined';
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
 * @apiDefine UnauthorizedError
 *
 * @apiError (Error 401) {Object} Unauthorized
 *      User has not logged in.
 *
 * @apiErrorExample {json} Error response example:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized",
 *       "message": "Error: User has not logged in."
 *     }
 */

/**
 * @apiDefine NotFoundError
 *
 * @apiError (Error 404) {Object} NotFound
 *      Resource not found.
 *
 * @apiErrorExample {json} Error response example:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found",
 *       "message": "Error: Resource not found."
 *     }
 */

/**
 * @api {get} /app2/api/cafes?lat=DDD&lng=DDD&radius=DDD&zoom=DDD Get cafes
 * @apiName getCafes
 * @apiGroup app2Cafes
 *
 * @apiParam (Query String Params) {Number} lat Circle center latitude.
 * @apiParam (Query String Params) {Number} lng Circle center longitude.
 * @apiParam (Query String Params) {Number} radius Circle radius.
 * @apiParam (Query String Params) {Number} zoom Map zoom.
 *
 * @apiSuccess {Cafe[]}     results                 Array of cafes inside given circle
 * @apiSuccess {String}     results.name            Cafe name
 * @apiSuccess {Timeslot[]} results.timeslots       Cafe timeslots
 * @apiSuccess {Date}       results.timeslots.start Cafe timeslot start time
 * @apiSuccess {User[]}     results.timeslots.users Users that planned the cafe timeslot
 * @apiSuccess {String}     results.timeslots.users.id User id
 * @apiSuccess {String}     results.timeslots.users.name User name
 *
 * @apiSuccessExample Success response example:
 *    curl -X GET https://ikarus512-fcc1.herokuapp.com \
 *          /app2/api/cafes?lat=56.312956&lng=43.989955&radius=188.796&zoom=16
 *    HTTP/1.1 200 OK
 *    [ { "_id": "5946d049de602f8d6b121f1c",
 *        "lat": 56.31200089999999,
 *        "lng": 43.99179479999999,
 *        "name": "Aladdin, Kafe",
 *        "text": "ulitsa Kostina, 2, Nizhny Novgorod",
 *        "photo": "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
 *        "timeslots": [] },
 *      { "_id": "5946d049de602f8d6b121f19",
 *        "lat": 56.311938,
 *        "lng": 43.99059800000001,
 *        "name": "Karamel'",
 *        "text": "ulitsa Kostina, 3, Nizhny Novgorod",
 *        "photo": "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
 *        "timeslots":[] } ]
 *
 * @apiUse NotFoundError
 */
// RESTAPI GET    /app2/api/cafes?lat=DDD&lng=DDD&radius=DDD&zoom=DDD - get cafes
router.get('/api/cafes', function(req, res, next) { // eslint-disable-line complexity

    var radius = 188.796, lat = 56.312956, lng = 43.989955, zoom = 16; // Nizhny
    // istanbul ignore else
    if (isFinite(Number(req.query.lat)))    { lat = Number(req.query.lat); }
    // istanbul ignore else
    if (isFinite(Number(req.query.lng)))    { lng = Number(req.query.lng); }
    // istanbul ignore else
    if (isFinite(Number(req.query.zoom)))   { zoom = Number(req.query.zoom); }
    // istanbul ignore else
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
        return res.status(200).json(cafes);
    })

    .catch(/*istanbul ignore next*/ function(err) {
        myErrorLog(null, err);
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    });

});

/**
 * @api {put} /app2/api/cafes Update user session state
 * @apiName putCafes
 * @apiGroup app2Cafes
 *
 * @apiParam (Body Params) {Number} lat Circle center latitude.
 * @apiParam (Body Params) {Number} lng Circle center longitude.
 * @apiParam (Body Params) {Number} radius Circle radius.
 * @apiParam (Body Params) {Number} zoom Map zoom.
 * @apiParam (Body Params) {String} [selectedCafeId=undefined] Selected cafe id.
 *
 * @apiParamExample {json} Parameter example:
 *    {
 *      "lat": 56.312956,
 *      "lng": 43.989955,
 *      "radius": 188.796,
 *      "zoom": 16,
 *      "selectedCafeId": "5946d049de602f8d6b121f1c"
 *    }
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *        https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X PUT -b ../cookies.jar -d 'lat=56.312956&lng=43.989955& \
 *        radius=188.796&zoom=16&selectedCafeId="5946d049de602f8d6b121f1c"' \
 *        https://ikarus512-fcc1.herokuapp.com/app2/api/cafes
 *    HTTP/1.1 200 OK
 *
 */
// RESTAPI PUT    /app2/api/cafes {lat,lng,radius,zoom,selectedCafeId} - update session state
router.put('/api/cafes', function(req, res, next) { // eslint-disable-line complexity

    req.session = req.session || /*istanbul ignore next*/ {};
    req.session.app2state = req.session.app2state || {};

    // Save user state to session
    // istanbul ignore else
    if (isFinite(Number(req.body.lat)))    { req.session.app2state.lat = Number(req.body.lat); }
    // istanbul ignore else
    if (isFinite(Number(req.body.lng)))    { req.session.app2state.lng = Number(req.body.lng); }
    // istanbul ignore else
    if (isFinite(Number(req.body.zoom)))   { req.session.app2state.zoom = Number(req.body.zoom); }
    // istanbul ignore else
    if (isFinite(Number(req.body.radius))) {
        req.session.app2state.radius = Number(req.body.radius);
    }
    if (req.body.selectedCafeId) {
        req.session.app2state.selectedCafeId = req.body.selectedCafeId;
    }

    res.status(200).json();

});

/**
 * @api {put} /app2/api/cafes/:cafeId/timeslots/:startTime/plan Plan cafe timeslot
 * @apiName planCafeTimeslot
 * @apiGroup app2Cafes
 *
 * @apiParam (Url Path Params) {String} cafeId Cafe id.
 * @apiParam (Url Path Params) {String} startTime Start time.
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *        https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X PUT -b ../cookies.jar \
 *        https://ikarus512-fcc1.herokuapp.com/app2/api/cafes/ \
 *        5946d049de602f8d6b121f1c/timeslots/15%20Aug%202017%2023:30:00/plan
 *    HTTP/1.1 200 OK
 *
 * @apiUse UnauthorizedError
 * @apiUse NotFoundError
 */
// RESTAPI PUT    /app2/api/cafes/:cafeId/timeslots/:startTime/plan - plan cafe timeslot
router.put('/api/cafes/:cafeId/timeslots/:startTime/plan', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Unauthorized',
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
        return res.status(404).json({
            error: 'Not Found',
            message: err.toString()
        });
    })

    // Internal error
    .catch(/*istanbul ignore next*/ function(err) {
        var message = 'Internal error e0000007.';
        myErrorLog(req, err, message);
        return res.status(404).json({
            error: 'Not Found',
            message: message
        });
    });

});

/**
 * @api {put} /app2/api/cafes/:cafeId/timeslots/:startTime/unplan Unplan cafe timeslot
 * @apiName unplanCafeTimeslot
 * @apiGroup app2Cafes
 *
 * @apiParam (Url Path Params) {String} cafeId Cafe id.
 * @apiParam (Url Path Params) {String} startTime Start time.
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *        https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X PUT -b ../cookies.jar \
 *        https://ikarus512-fcc1.herokuapp.com/app2/api/cafes/ \
 *        5946d049de602f8d6b121f1c/timeslots/15%20Aug%202017%2023:30:00/unplan
 *    HTTP/1.1 200 OK
 *
 * @apiUse UnauthorizedError
 * @apiUse NotFoundError
 */
// RESTAPI PUT    /app2/api/cafes/:cafeId/timeslots/:startTime/unplan - unplan cafe timeslot
router.put('/api/cafes/:cafeId/timeslots/:startTime/unplan', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Error: Only authorized person can unplan cafe timeslot.'
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
    .catch(PublicError, /*istanbul ignore next*/ function(err) {
        return res.status(404).json({
            error: 'Not Found',
            message:err.toString()
        });
    })

    // Internal error
    .catch(/*istanbul ignore next*/ function(err) {
        var message = 'Internal error e0000007.';
        myErrorLog(req, err, message);
        return res.status(404).json({
            error: 'Not Found',
            message:message
        });
    });

});

module.exports = router;
