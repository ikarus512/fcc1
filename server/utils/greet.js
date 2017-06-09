/* file: greet.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Parameters for Views
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var extend = require('extend'),
  pugParams = require('../../src/views/pug-params.js').web;

function greet(req,o2,o3) {
  var o={};

  var uid;
  if (req.isAuthenticated()) uid = req.user._id;

  if (req.user) {
    extend(o, {
      //greeting : 'Hi, '+req.user.name+' ('+req.user.type+')!',
      username : req.user.name,
      logintype: req.user.type,
      uid      : uid,
    });
  } else {
    //o.greeting='(Not logged in.)';
  }

  extend(o,o2,o3,pugParams);

  return o;
}

module.exports = greet;
