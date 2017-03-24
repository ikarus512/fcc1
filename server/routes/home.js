'use strict';

var User = require('../models/users'),
  path = require('path'),
  shareit = require(path.join(__dirname, '../utils/shareit.js'));

module.exports = function (app, passport, isLoggedIn, greet) {

  // / route (home, unprotected)
  app.route('/')
  .get(function (req, res) {
    var savedUrl = req.flash('savedUrl')[0];
    if (savedUrl) return res.redirect(savedUrl);

    res.render('home', greet(
      req,
      shareit({
        title: 'DynApps',
        text: 'DynApps',
        img: req.protocol+'://'+req.hostname+'img/pixabay_com_world.jpg',
        url: req.protocol+'://'+req.hostname+req.originalUrl,
      })
    ));
  });

};
