/* file: home.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Home Route
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
    User = require('../models/users.js'),
    path = require('path'),
    shareit = require(path.join(__dirname, '../utils/shareit.js'));

module.exports = function (app, passport, isLoggedIn, greet) {

    // / route (home, unprotected)
    app.route('/')
    .get(function(req, res) {
        var savedUrl = req.flash('savedUrl')[0];
        // istanbul ignore next
        if (savedUrl) { return res.redirect(savedUrl); }

        res.render('home', greet(
          req,
          shareit({
            title: 'DynApps',
            text: 'DynApps',
            img: req.protocol + '://' + req.hostname + 'img/pixabay_com_world.jpg',
            url: req.protocol + '://' + req.hostname + req.originalUrl
        })
        ));
    });

};
