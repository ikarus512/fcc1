/* file: init-app5.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App5 Test Initializations
 * AUTHOR: ikarus512
 * CREATED: 2017/07/18
 *
 * MODIFICATION HISTORY
 *  2017/07/18, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var
    Promise = require('bluebird'),
    usersInit = require('./init-users.js'),

    result;

function initApp5Data() {
    var resultTmp = {};

    if (result) {
        return Promise.resolve(result);
    }

    return usersInit()
    .then(function(res) {
        resultTmp.users = res;
        result = resultTmp;
        return result;
    });
}

module.exports = initApp5Data;
