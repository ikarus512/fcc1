/* file: ajax-loading-spinner.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_components')

    .directive('ajaxLoadingSpinner', [
        '$timeout', 'MyConst',
        function ajaxLoadingSpinner($timeout, MyConst) {
            return {
                restrict: 'E',
                templateUrl: MyConst.urlPref + 'js/common/_components/ajax-loading-spinner.html',
                scope: {
                    ajaxLoadingVar: '@',
                    addClass: '='
                },
                link: function linkFunction(scope, element, attrs) {
                    scope.urlPref = MyConst.urlPref;
                    scope.$watch('ajaxLoadingVar', function(val) {
                        if (val && (val > 0)) {
                            $(element).show();
                        } else {
                            $(element).hide();
                        }
                    });
                } // link: function linkFunction(...)
            };
        } // function ajaxLoadingSpinner(...)
    ]); // .directive('ajaxLoadingSpinner', ...

}());
