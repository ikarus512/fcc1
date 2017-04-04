/* file: settings.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Settings Route
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

module.exports = function (app, passport, isLoggedIn, greet) {

  // /settings route (protected)
  app.route('/settings')
  .get(isLoggedIn, function (req, res) {
    res.render('settings', greet(req));
  });

};
