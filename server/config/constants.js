/* file: constants.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Application Constants
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *  2017/04/13, ikarus512. Google APIs enabled only on Heroku.
 *
 */

/*jshint node: true*/
'use strict';

var
  isHeroku = require('./../utils/is-heroku.js');

module.exports = {
  APP2_GOOGLE_SEARCH_ENABLED: isHeroku(),
  APP2_MAX_TIMESLOTS: 4,
  APP2_TIMESLOT_LENGTH: 30, // timeslot length in minutes (must divide 60)
};
