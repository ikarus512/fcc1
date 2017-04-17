/* file: app3.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App3 Routes
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var express = require('express'),
  router = express.Router(),
  path = require('path'),
  wsStore = require('./../utils/app3/web-sockets-store.js'),
  greet = require(path.join(__dirname, '../utils/greet.js')),
  createUnauthorizedUser = require('./../middleware/create-unauthorized-user.js'),
  myErrorLog = require('../utils/my-error-log.js');


// /app3
router.get('/',
  function(req, res) {
    if (req.user) wsStore.add(req.user.name);
    res.render('app3_stock', greet(req));
  }
);



module.exports = router;
