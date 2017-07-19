/* file: admin-password.js */
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

var ADMIN_PASSWORD;
if (process.env.NODE_ENV === 'production') {
    ADMIN_PASSWORD = 'admin'; // Unsecure to keep it here:) But ok for education purposes.
} else { // test* environment
    ADMIN_PASSWORD = '1234';
}

module.exports = ADMIN_PASSWORD;
