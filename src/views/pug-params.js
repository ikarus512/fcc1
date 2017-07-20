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

var
    // TODO:
    //    hostLocal = 'localhost:5000', // developement/test
    //    hostHeroku = 'localhost:5000', // production
    //    host = APPENV.isHeroku ? hostHeroku : hostLocal,
    host = 'ikarus512-fcc1.herokuapp.com'; // production

module.exports = {
    web: {
        webApp: true,
        mobileApp: false,
        urlPref: '/',
        urlPrefix: '',
        serverUrl: '',
        // webSocketHost: 'wss://' + window.document.location.host,

        useGoogleMaps: false, // TODO: APPENV.isHeroku ? true : false,
    },
    mobile: {
        webApp: false,
        mobileApp: true,
        urlPref: '',
        urlPrefix: '#!',
        serverUrl: 'https://' + host,
        // webSocketHost: 'wss://' + host,

        useGoogleMaps: false,
    },
};
