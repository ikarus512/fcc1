/* file: directive-my-escape.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .directive('myEscape', function () {

        var ESCAPE_KEY = 27;

        return function (scope, elem, attrs) {
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

})();
