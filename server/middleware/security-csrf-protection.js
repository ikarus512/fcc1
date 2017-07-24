/* file: security-csrf-protection.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: CSRF Protection
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
    csrf = require('csurf'),
    myCsrf = {},
    myErrorLog = require('../utils/my-error-log.js');

myCsrf.protection =

  (APPCONST.env.NODE_ENV === 'production') ?

  // Here if production:
  csrf({
    cookie: false, // Keep tocken secret in session, not in cookie
    key: '_csrf',
    httpOnly: true,  // dont let browser javascript access cookie ever
    secure: true // only use cookie over https
})

  :

  // Here if test env:
  // Switch off CSRF
  function(req,res,next) {
    req.csrfToken = function() { return 1; };
    next();
};

myCsrf.errHandler = function csrfErrorHandler(err, req, res, next) {
    if (err && err.code === 'EBADCSRFTOKEN') {
        // handle CSRF token errors here

        // c onsole.log('---File: '+new Error().stack.split('\n')[1]);
        // c onsole.log('req.session=',req.session)
        // c onsole.log('res.headers=',res.headers)
        myErrorLog(req, err);
        // res.status(403)
        // res.send('form tampered with')

    }

    return next(err);

};

module.exports = myCsrf;
