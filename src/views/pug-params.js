/* file: pug-params.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Parameters for Views
 * AUTHOR: ikarus512
 * CREATED: 2017/06/09
 *
 * MODIFICATION HISTORY
 *  2017/06/09, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
'use strict';

module.exports = {
  web: {
    webApp: true,
    mobileApp: false,
    urlPref: '/',
  },
  mobile: {
    webApp: false,
    mobileApp: true,
    urlPref: '',
  },
};
