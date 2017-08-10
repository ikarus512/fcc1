/* file: filter-photo.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('app4filters')

    .filter('photo', function photoFilter() {
        return function photoFunction(text) {
            if (!text) { return text; }
            return '/img/app4tmp/' + text + '.jpg';
        };
    }); // .filter('photo', ...

}());
