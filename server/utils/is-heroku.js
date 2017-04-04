/* file: is-heroku.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: IsHeroku Check
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var HEROKU_APP_URL = 'https://ikarus512-fcc1.herokuapp.com';

function isHeroku() {
  return process.env.APP_URL === HEROKU_APP_URL;
}

module.exports = isHeroku;
