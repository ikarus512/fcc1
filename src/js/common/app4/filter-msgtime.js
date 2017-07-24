/* file: filter-msgtime.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .filter('msgtime', ['$filter', function($filter) {
        return function(date) {
            if (!date) { return date; }

            date = new Date(date);

            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            if (date < today) { // Not today
                return $filter('date')(date, 'yyyy MMM d, H:mm:ss');
            }

            // Today
            return $filter('date')(date, 'H:mm:ss');
        };
    }]); // .filter('msgtime', ...

})();
