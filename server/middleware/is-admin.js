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

module.exports = function isAdmin(req, res, next) {
    if (
      req.isAuthenticated() &&
      req.user && req.user.local && req.user.local.username === 'admin'
    )
    {
        return next(null);
    }

    res.redirect('/');

};
