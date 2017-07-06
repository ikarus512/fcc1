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
  csrf = require('csurf'),
  csrfProtection = csrf({
    cookie: false, // Keep tocken secret in session, not in cookie
    key: '_csrf',

    httpOnly: true,  // dont let browser javascript access cookie ever
    secure: true, // only use cookie over https
  });

module.exports = csrfProtection;
