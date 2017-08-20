/* file: app1poll.module.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    /**
     * @namespace app1poll
     * @desc app1poll angular module
     * @requires clients.Modules.a_common
     * @requires clients.Modules.a_components
     * @memberOf clients.Modules
     */
    angular.module('app1poll', [
        'chart.js',
        'ngRoute',

        'a_common',
        'a_components'
    ]);

}());
