'use strict';

var User = require('../models/users');

module.exports = function (app, passport, isLoggedIn, greet) {

  // /settings route (protected)
  app.route('/settings')
  .get(isLoggedIn, function (req, res) {
    res.render('settings', greet(req));
  });

};
