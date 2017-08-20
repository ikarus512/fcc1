/* file: mobileApp.module.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    /**
     * @namespace mobileApp
     * @desc mobileApp angular module
     * @requires clients.Modules.app1poll
     * @requires clients.Modules.app1polls
     * @requires clients.Modules.app2
     * @requires clients.Modules.app3
     * @requires clients.Modules.app4book
     * @requires clients.Modules.app4books
     * @requires clients.Modules.app4filters
     * @requires clients.Modules.a_common
     * @requires clients.Modules.a_components
     * @memberOf clients.Modules
     */
    angular.module('mobileApp', [
      'chart.js',
      'ngRoute',
      'ngAnimate',
      'ngMessages',
      'ngFileUpload',

      'app1poll',
      'app1polls',
      'app2',
      'app3',
      'app4book',
      'app4books',
      'app4filters',

      'a_common',
      'a_components'
    ]);

}());
