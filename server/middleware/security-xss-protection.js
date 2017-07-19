/* file: security-xss-protection.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: CSS Protection
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

module.exports = function(obj) {
    for (var key in obj) {
        // HTML sanitizers not used currently.
        // Escape all non-character symbols.
        // In fact, remove all unallowed symbols.
        if (typeof(obj[key]) === 'string') {
            obj[key] = obj[key].replace(/[^a-zA-Z0-9\_\-\ \.\,\:\'\"]/g,'');
        }
    }

    return;
};
