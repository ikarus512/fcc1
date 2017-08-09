/* file: directive-keep-focus.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @ngdoc directive
 * @memberof myapp
 * @name directive-keep-focus
 * @param Attr2Options {service} convert html attribute to Google map api options
 * @param $timeout {service} AngularJS $timeout
 * @description
 *   Marker with html
 *   Requires:  map directive
 *   Restrict To:  Attribute
 *
 * @attr {String} position required, position on map
 * @attr {Number} z-index optional
 * @attr {Boolean} visible optional
 * @example
 *
 * Example:
 *   <map center="41.850033,-87.6500523" zoom="3">
 *     <custom-marker position="41.850033,-87.6500523">
 *       <div>
 *         <b>Home</b>
 *       </div>
 *     </custom-marker>
 *   </map>
 *
 */
(function() {
    'use strict';

    angular.module('myapp')

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
