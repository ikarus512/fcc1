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
 * @api {get} /app3/api/get-ws-ticket Get web socket ticket
 * @apiName getWsTicket
 * @apiGroup ticket
 */
// RESTAPI GET    /app3/api/get-ws-ticket - get web socket ticket
router.get('/api/get-ws-ticket', function(req, res, next) {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Error: Only authorized person can get Web Socket ticket.'
        });
    }

    try {

        var ticket = wsStore.ticketGenerate(req.user.name);

        return res.status(200).json({ticket: ticket});

    } catch (err) {

        if (err instanceof PublicError) {
            return res.status(400).json({message:err.toString()});
        } else {
            var message = 'Internal error e0000009.';
            myErrorLog(null, err, message);
            return res.status(400).json({message:message});
        }

    }

});

module.exports = router;
