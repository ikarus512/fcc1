/* file: app-url.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Application Url
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var appUrls = {
  production:   process.env.APP_URL,
  development:  process.env.APP_URL,
  test:         process.env.APP_URL,
};

module.exports = appUrls[process.env.NODE_ENV];
