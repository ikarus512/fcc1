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

var host = 'ikarus512-fcc1.herokuapp.com'; // production
// var host = 'localhost:5000'; // developement

module.exports = {
    web: {
        webApp: true,
        mobileApp: false,
        urlPref: '/',
        urlPrefix: '',
        serverUrl: '',
        // webSocketHost: 'wss://' + window.document.location.host,
    },
    mobile: {
        webApp: false,
        mobileApp: true,
        urlPref: '',
        urlPrefix: '#!',
        serverUrl: 'https://' + host,
        // webSocketHost: 'wss://' + host,
    },
};
