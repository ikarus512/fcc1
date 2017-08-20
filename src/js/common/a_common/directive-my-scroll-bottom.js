/* file: directive-my-scroll-bottom.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Directives
 * @desc common directives
 * @memberOf clients.Modules.a_common
 */
(function() {
    'use strict';

    angular
    .module('a_common')
    .directive('myScrollBottom', myScrollBottom);

    myScrollBottom.$inject = [
        '$timeout'
    ];

    /**
     * @classdesc attribute directive to scroll ng-repeat array to bottom
     * @class
     * @param {Object} $timeout
     * @memberOf clients.Modules.a_common.Directives
     *
     * @example {@lang xml}
     * <div my-scroll-bottom='msgs'>
     *     <div ng-repeat='msg in msgs'>
     *         {{msg}}
     *     </div>
     * </div>
     */
    function myScrollBottom($timeout) {

        /**
         * @member {Object}
         * @memberOf clients.Modules.a_common.Directives.myScrollBottom
         * @type {Object}
         *
         * @property {String} restrict Restricted to attributes
         * @property {Object} scope Scoped variables
         * @property {Object} scope.myScrollBottom  ng-repeat array name to scroll
         * @property {function} link Link fuction
         */
        var directive = {
            restrict: 'A',
            scope: {
                myScrollBottom: '='
            },
            link: linkFunction
        };

        return directive;

        ////////////////////////////////////////

        /**
         * Link function
         * @alias link
         * @static
         * @param {Object} $scope
         * @param {Object} $element
         * @memberOf clients.Modules.a_common.Directives.myScrollBottom
         */
        function linkFunction($scope, $element) {
            $scope.$watchCollection('myScrollBottom', function (newValue) {
                if (newValue) {
                    $timeout(function() {
                        $element.scrollTop($element[0].scrollHeight);
                    }, 0);
                }
            });
        } // function linkFunction(...)

    } // function myScrollBottom(...)

}());
