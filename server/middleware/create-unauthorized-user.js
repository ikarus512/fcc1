/* file: create-unauthorized-user.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Create Unauthorized User
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var User = require('../models/users.js');

module.exports = function(req, res, next) {

    if (req.isAuthenticated() || req.unauthorizedUser) {
        return next();
    }

    User.createUnauthorizedUser(req.ip)

    // Save user to req.unauthorizedUser
    .then(function(user) {
        // istanbul ignore else
        if (!req.unauthorizedUser) {
            req.unauthorizedUser = {};
            req.unauthorizedUser._id = user._id;
            req.unauthorizedUser.ip = req.ip;
        }
        return next();
    })

    // Ignore errors
    .catch(/*istanbul ignore next*/ function(err) { // eslint-disable-line handle-callback-err
        return next();
    });

};
