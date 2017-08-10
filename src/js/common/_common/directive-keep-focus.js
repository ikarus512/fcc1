/* file: directive-keep-focus.js */
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
    .directive('keepFocus', keepFocus);

    keepFocus.$inject = [
        '$timeout'
    ];

    /**
     * @classdesc keepFocus directive (keep focus after ng-repeat sorting)
     * @class
     * @param {Object} $timeout
     * @memberOf clients.Modules._common.Directives
     *
     * @example {@lang xml}
     *
     * <textarea
     *     keep-focus
     *     keep-focus-var='{{bid.biddersEditMsgFocusVar}}'
     *     keep-focus-index='{{$index}}'
     * >
     * </textarea>
     */
    function keepFocus($timeout) {

        /**
         * @member {Object}
         * @memberOf clients.Modules._common.Directives.keepFocus
         * @type {Object}
         *
         * @property {String} restrict Restricted to attributes
         * @property {Object} scope Scoped variables
         * @property {Object} scope.keepFocusVar  keepFocus variable name
         * @property {number} scope.keepFocusIndex keepFocus index
         * @property {function} link Link fuction
         */
        var directive = {
            restrict: 'A',
            scope: {
                keepFocusVar: '@',
                keepFocusIndex: '@'
            },
            link: linkFunction
        };

        return directive;

        ////////////////////////////////////////

        /**
         * Link function
         * @static
         * @param {Object} scope
         * @param {Object} element
         * @param {Object} attrs
         * @memberOf clients.Modules._common.Directives.keepFocus
         */
        function linkFunction(scope, element, attrs) {
            scope.$watch('keepFocusIndex', function(newVal, prevVal) {
                if (scope.keepFocusVar) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        } // function linkFunction(...)

    } // function keepFocus(...)

}());
