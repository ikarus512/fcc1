/* file: ajax-loading-spinner.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Components
 * @desc common components
 * @memberOf clients.Modules._components
 */
(function() {
    'use strict';

    angular
    .module('_components')
    .directive('ajaxLoadingSpinner', ajaxLoadingSpinner);

    ajaxLoadingSpinner.$inject = [
        '$timeout', 'MyConst'
    ];

    /**
     * @classdesc ajax-loading-spinner component
     * @class
     * @param {Object} $timeout
     * @param {Object} MyConst
     * @memberOf clients.Modules._components.Components
     *
     * @example {@lang xml}
     * <ajax-loading-spinner
     *     ajax-loading-var='{{ajaxLoadingSpinner}}'
     * >
     * </ajax-loading-spinner>
     *
     * <ajax-loading-spinner
     *     add-class='"small"'
     *     ajax-loading-var='{{ajaxLoadingSpinnerSmall}}'
     * >
     * </ajax-loading-spinner>
     */
    function ajaxLoadingSpinner($timeout, MyConst) {

        /**
         * @member {Object}
         * @memberOf clients.Modules._components.Components.ajaxLoadingSpinner
         * @type {Object}
         *
         * @property {String} restrict Restricted to elements
         * @property {String} templateUrl template url
         * @property {Object} scope Scoped variables
         * @property {Object} scope.ajaxLoadingVar spinner's trigger variable name
         * @property {number} [scope.addClass=undefined|"small"] class of spinner
         * @property {function} link Link fuction
         */
        var component = {
            restrict: 'E',
            templateUrl: MyConst.urlPref + 'js/common/_components/ajax-loading-spinner.html',
            scope: {
                ajaxLoadingVar: '@',
                addClass: '='
            },
            link: linkFunction
        };

        return component;

        ////////////////////////////////////////

        /**
         * Link function
         * @alias link
         * @static
         * @param {Object} scope
         * @param {Object} element
         * @param {Object} attrs
         * @memberOf clients.Modules._components.Components.ajaxLoadingSpinner
         */
        function linkFunction(scope, element, attrs) {
            scope.urlPref = MyConst.urlPref;
            scope.$watch('ajaxLoadingVar', function(val) {
                if (val && (val > 0)) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            });
        } // function linkFunction(...)

    } // function ajaxLoadingSpinner(...)

}());
