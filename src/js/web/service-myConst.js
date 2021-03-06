/* file: service-myConst.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('a_common')

    .service('MyConst', function MyConst() {

        this.urlPref = '/';
        this.urlPrefix = '';
        this.serverUrl = '';
        this.webSocketHost = 'wss://' + window.document.location.host;
        this.webApp = true;
        this.mobileApp = !this.webApp;

    }); // .service('MyConst', ...

}());
