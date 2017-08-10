/* file: directive-my-focus.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .directive('myFocus', ['$timeout', function myFocus($timeout) {

        return function linkFunction(scope, elem, attrs) {
            scope.$watch(attrs.myFocus, function (newVal) {
                if (newVal) {
                    $timeout(function() {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        };

    }]); // .directive('myFocus', ...

}());
