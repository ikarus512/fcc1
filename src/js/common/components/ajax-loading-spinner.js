/* file: ajax-loading-spinner.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 *  @ngdoc component
 *  @memberof myapp
 *  @name ajax-loading-spinner
 *  @restrict E
 *  @description
 *      Ajax loader spinner
 *
 *  @attr {String} ajax-loading-var optional, toggle variable (if positive, then spinner visible)
 *  @example
 *
 *  Example:
 *      <ajax-loading-spinner
 *          ajax-loading-var='{{ajaxLoadingSpinner}}'
 *      >
 *      </ajax-loading-spinner>
 *
 */
(function() {
    'use strict';

    angular.module('myapp')

    .directive('ajaxLoadingSpinner', [
        '$timeout', 'MyConst',
        function ajaxLoadingSpinner($timeout, MyConst) {
            return {
                restrict: 'E',
                templateUrl: MyConst.urlPref + 'js/common/components/ajax-loading-spinner.html',
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
