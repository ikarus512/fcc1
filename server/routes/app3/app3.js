/* file: app3.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App3 Routes
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
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    wsStore = require('../../utils/app3/web-socket-store.js'),
    greet = require(path.join(__dirname, '../../utils/greet.js')),
    createUnauthorizedUser = require('../../middleware/create-unauthorized-user.js'),
    PublicError = require('../../utils/public-error.js'),
    myErrorLog = require('../../utils/my-error-log.js'),
    myEnableCORS = require('../../middleware/my-enable-cors.js');

// /app3
router.get('/',
  function(req, res) {
    res.render('app3_stock', greet(req));
}
);

////////////////////////////////////////////////////////////////////////////////////////////////////

// Enable CORS on selected REST API
router.all('/api/get-ws-ticket', myEnableCORS);

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
 * @api {get} /app3/api/get-ws-ticket Get web socket ticket
 * @apiName getWsTicket
 * @apiGroup app3Ticket
 *
 * @apiSuccess {String}     ticket                 Ticket id.
 *
 * @apiSuccessExample Success response example:
 *    curl -X POST -c ../cookies.jar -d 'username=a&password=a' \
 *        https://ikarus512-fcc1.herokuapp.com/auth/api/local
 *    curl -X GET -b ../cookies.jar https://ikarus512-fcc1.herokuapp.com \
 *          /app3/api/get-ws-ticket
 *    HTTP/1.1 200 OK
 *    {"ticket":"641caf2316b096aecc"}
 *
 * @apiUse UnauthorizedError
 * @apiUse NotFoundError
 */
// RESTAPI GET    /app3/api/get-ws-ticket - get web socket ticket
router.get('/api/get-ws-ticket', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Error: Only authorized person can get Web Socket ticket.'
        });
    }

    try {

        var ticket = wsStore.ticketGenerate(req.user.name);

        return res.status(200).json({ticket: ticket});

    } catch (err) {

        if (err instanceof PublicError) {
            return res.status(404).json({
                error: 'Not Found',
                message:err.toString()
            });
        } else {
            var message = 'Internal error e0000009.';
            myErrorLog(null, err, message);
            return res.status(404).json({
                error: 'Not Found',
                message: message
            });
        }

    }

});

module.exports = router;
