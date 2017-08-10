/* file: app2.module.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App2 angular module definition
 * AUTHOR: ikarus512
 * CREATED: 2017/06/01
 *
 * MODIFICATION HISTORY
 *  2017/06/01, ikarus512. Initial version.
 *
 */

(function() {
    'use strict';

    /**
     * @namespace app2
     * @desc app2 angular module
     * @requires clients.Modules._common
     * @requires clients.Modules._components
     * @memberOf clients.Modules
     */
    angular.module('app2', [
        '_common',
        '_components'
    ]);

}());
