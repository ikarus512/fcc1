/* file: is-admin.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Admin Access Check Middleware
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

module.exports = {
    check: /*istanbul ignore next*/ function check(req, res, next) {
        if (
          req.isAuthenticated() &&
          req.user && req.user.local && req.user.local.username === 'admin'
        )
        {
            return next();
        }

        return next(new Error('Please login as admin to see statmon page'));

    },

    errHandler: /*istanbul ignore next*/ function errHandler(err, req, res, next) {

        // res.redirect('/login');

        var message = 'Internal error e0000015.';
        // myErrorLog(req, err, message);
        return res.status(404).json({
            error: 'Not Found',
            message: message
        });

    }

};
