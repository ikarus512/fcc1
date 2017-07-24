/* file: ajax-loading-spinner.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .directive('ajaxLoadingSpinner', ['$timeout', 'MyConst', function($timeout, MyConst) {
        return {
            restrict: 'E',
            templateUrl: MyConst.urlPref + 'js/common/components/ajax-loading-spinner.html',
            scope: {
                ajaxLoadingVar: '@',
                addClass: '=',
            },
            link: function(scope, element, attrs) {
                scope.urlPref = MyConst.urlPref;
                scope.$watch('ajaxLoadingVar', function(val) {
                    if (val && (val > 0)) {
                        $(element).show();
                    } else {
                        $(element).hide();
                    }
                });
            },
        };
    }]); // .directive('ajaxLoadingSpinner', ...

})();
