/* file: directive-my-enter.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .directive('myEnter', function myEnter() {

        var ENTER_KEY = 13;

        return function linkFunction(scope, elem, attrs) {
            elem.bind('keyup', function (event) {
                if (event.keyCode === ENTER_KEY) {
                    scope.$apply(attrs.myEnter);
                }
            });

            scope.$on('$destroy', function () {
                elem.unbind('keyup');
            });
        };

    }); // .directive('myEnter', ...

}());
