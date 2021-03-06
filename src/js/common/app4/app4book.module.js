/* file: app4book.module.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    /**
     * @namespace app4book
     * @desc app4book angular module
     * @requires clients.Modules.a_common
     * @requires clients.Modules.a_components
     * @requires clients.Modules.app4filters
     * @memberOf clients.Modules
     */
    angular.module('app4book', [
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngFileUpload',

        'a_common',
        'a_components',
        'app4filters'
    ]);

}());
