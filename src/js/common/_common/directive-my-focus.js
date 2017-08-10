/* file: directive-my-focus.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Directives
 * @desc common directives
 * @memberOf clients.Modules._common
 */
(function() {
    'use strict';

    angular
    .module('_common')
    .directive('myFocus', myFocus);

    myFocus.$inject = [
        '$timeout'
    ];

    /**
     * @classdesc attribute directive to focus element when expression is true
     * @class
     * @param {Object} $timeout
     * @memberOf clients.Modules._common.Directives
     *
     * @example {@lang xml}
     *
     * <input my-focus='expression'>
     * </input>
     */
    function myFocus($timeout) {

        return linkFunction;

        ////////////////////////////////////////

        /**
         * Link function
         * @alias link
         * @static
         * @param {Object} scope
         * @param {Object} elem
         * @param {Object} attrs
         * @memberOf clients.Modules._common.Directives.myFocus
         */
        function linkFunction(scope, elem, attrs) {
            scope.$watch(attrs.myFocus, function (newVal) {
                if (newVal) {
                    $timeout(function() {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        } // function linkFunction(...)

    } // function myFocus(...)

}());
