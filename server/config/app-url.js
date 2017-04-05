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
  production:     process.env.APP_URL,
  'test-int':     "https://127.0.0.1:5000",
  'test-int-cov': "https://127.0.0.1:5000",
  'test-e2e':     "https://127.0.0.1:5000",
};

module.exports = appUrls[process.env.NODE_ENV];
