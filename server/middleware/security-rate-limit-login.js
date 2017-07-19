/* file: security-rate-limit-login.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Security Login Rate Limit
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
  RateLimit = require('express-rate-limit');

var limiter =

  (APPCONST.env.NODE_ENV === 'production') ?

  // Here if production:
  new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    delayMs: 10 * 1000, // delay 10 s
    keyGenerator: function(req) { return req.ip; }, // limit per each IP
})

  :

  // Here if test env:
  function(err, req, res, next) {
    return next(err);
};

module.exports = limiter;
