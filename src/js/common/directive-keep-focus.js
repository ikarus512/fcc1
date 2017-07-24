/* file: directive-keep-focus.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .directive('keepFocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            scope: {
                keepFocusVar: '@',
                keepFocusIndex: '@',
            },
            link: function(scope, element, attrs) {
                scope.$watch('keepFocusIndex', function(newVal, prevVal) {
                    if (scope.keepFocusVar) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            },
        };
    }]); // .directive('keepFocus', ...

}());
