/* file: app4books.module.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    /**
     * @namespace app4books
     * @desc app4books angular module
     * @requires clients.Modules._common
     * @requires clients.Modules._components
     * @requires clients.Modules.app4filters
     * @memberOf clients.Modules
     */
    angular.module('app4books', [
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngFileUpload',

        '_common',
        '_components',
        'app4filters'
    ]);

}());
