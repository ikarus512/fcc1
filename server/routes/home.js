'use strict';

var User = require('../models/users');

module.exports = function (app, passport, isLoggedIn, greet) {

  // / route (home, unprotected)
  app.route('/')
  .get(function (req, res) {
    var savedUrl = req.flash('savedUrl')[0];
    if (savedUrl) return res.redirect(savedUrl);

    res.render('home', greet(req));
  });

};
