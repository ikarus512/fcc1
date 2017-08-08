/* file: service-myConst.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .value('backendParams', {}) // not used in mobile app

    .service('MyConst', function MyConst() {

        var host;

        if (window && window.cordova && window.cordova.platformId === 'browser') {
            host = 'localhost:5000'; // developement
        } else {
            // Here if run on devide (android)
            host = 'ikarus512-fcc1.herokuapp.com'; // production
        }

        this.urlPref = '';
        this.urlPrefix = '#!';
        this.serverUrl = 'https://' + host;
        this.webSocketHost = 'wss://' + host;
        this.webApp = false;
        this.mobileApp = !this.webApp;

    }); // .service('MyConst', ...

}());
