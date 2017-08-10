/* file: directive-my-escape.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .directive('myEscape', function myEscape() {

        var ESCAPE_KEY = 27;

        return function linkFunction(scope, elem, attrs) {
            elem.bind('keyup', function (event) {
                if (event.keyCode === ESCAPE_KEY) {
                    scope.$apply(attrs.myEscape);
                }
            });

            scope.$on('$destroy', function () {
                elem.unbind('keyup');
            });
        };

    }); // .directive('myEscape', ...

}());