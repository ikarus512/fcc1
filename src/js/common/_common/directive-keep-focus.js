/* file: directive-keep-focus.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .directive('keepFocus', ['$timeout', function keepFocus($timeout) {
        return {
            restrict: 'A',
            scope: {
                keepFocusVar: '@',
                keepFocusIndex: '@'
            },
            link: function linkFunction(scope, element, attrs) {
                scope.$watch('keepFocusIndex', function(newVal, prevVal) {
                    if (scope.keepFocusVar) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            } // link: function linkFunction(...)
        };
    }]); // .directive('keepFocus', ...

}());