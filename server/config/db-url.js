/* file: db-url.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: DataBase Url
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var dbUrls = {
  production: process.env.APP_MONGODB_URI ? process.env.APP_MONGODB_URI : 'mongodb://localhost:27017/dbname',
  'test-int':     'mongodb://localhost:27017/dbname-test-int',
  'test-int-cov': 'mongodb://localhost:27017/dbname-test-int-cov',
  'test-e2e':     'mongodb://localhost:27017/dbname-test-e2e',
};

module.exports = process.env.NODE_ENV ? dbUrls[process.env.NODE_ENV] : 'mongodb://localhost:27017/dbname';
