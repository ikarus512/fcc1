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

var User = require('../models/users');

module.exports = function(req, res, next) {

  if (req.isAuthenticated() || req.unauthorized_user) {
    return next();
  }

  User.createUnauthorizedUser(req.ip)

  // Save user to req.unauthorized_user
  .then( function(user) {
    if (!req.unauthorized_user) {
      req.unauthorized_user = {};
      req.unauthorized_user._id = user._id;
      req.unauthorized_user.ip = req.ip;
    }
    return next();
  })

  // Ignore errors
  .catch( function(err) {
    return next();
  });

};
