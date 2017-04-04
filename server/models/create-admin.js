/* file: create-admin.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Function to Create Admin
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
  ADMIN_PASSWORD,
  User = require('../models/users'),
  myErrorLog = require('../utils/my-error-log.js');

if (process.env.NODE_ENV === 'production') {
  ADMIN_PASSWORD = 'admin'; // Unsecure to keep it here:) But ok for education purposes.
} else { // developement/test environment
  ADMIN_PASSWORD = '1234';
}


module.exports = function (callback) {

  return User.createLocalUser({
    username: 'admin',
    password: ADMIN_PASSWORD,
    password2: ADMIN_PASSWORD,
  })

  .then(function(err){
    if (callback) return callback();
    return;
  })

  .catch(function(err){
    // no throw err, as we ignore errors here
    myErrorLog(null, err); // log error
    if (callback) return callback(err);
    return;
  });

};
