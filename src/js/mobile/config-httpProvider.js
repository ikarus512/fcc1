/* file: config-httpProvider.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .config(['$httpProvider', function appConfigHttp($httpProvider) {

        $httpProvider.defaults.withCredentials = true;
        // $httpProvider.defaults.useXDomain = true;
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    }]); // .config(...)

}());
