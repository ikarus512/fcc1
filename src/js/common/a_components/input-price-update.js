/* file: input-price-update.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Components
 * @desc common components
 * @memberOf clients.Modules.a_components
 */
(function() {
    'use strict';

    angular
    .module('a_components')
    .directive('inputPriceUpdate', inputPriceUpdate);

    inputPriceUpdate.$inject = [
        '$timeout', 'MyConst'
    ];

    /**
     * @classdesc input-price-update component
     * @class
     * @param {Object} $timeout
     * @param {Object} MyConst
     * @memberOf clients.Modules.a_components.Components
     *
     * @example {@lang xml}
     * <input-price-update
     *     placeholder='\'Bid Price\''
     *     name='price{{bid._id}}'
     *     error='updateBidForm[\'price\'+bid._id].$error'
     *     ng-model='bid.updateBidPrice'
     *     my-enter='updateBid(updateBidForm[\'price\'+bid._id].$valid, '+
     *         'bid.price, bid.updateBidPrice)'
     *     my-focus='bid.focusMe'
     *     sort-index='{{$index}}'
     * >
     * </input-price-update>
     */
    function inputPriceUpdate($timeout,  MyConst) {

        /**
         * @member {Object}
         * @memberOf clients.Modules.a_components.Components.inputPriceUpdate
         * @type {Object}
         *
         * @property {String} restrict Restricted to elements
         * @property {String} templateUrl template url
         * @property {Object} scope Scoped variables
         * @property {Object} scope.placeholder
         * @property {Object} scope.name
         * @property {Object} scope.error
         * @property {Object} scope.ngModel
         * @property {Object} scope.myFocus
         * @property {Object} scope.myEnter
         * @property {Object} scope.sortIndex
         * @property {function} link Link fuction
         */
        var component = {

            restrict: 'E',

            scope: {
                placeholder: '=',
                name: '@',
                error: '=',
                ngModel: '=',
                myFocus: '=',
                myEnter: '&',

                sortIndex: '@'
            },

            templateUrl: MyConst.urlPref + 'js/common/a_components/input-price-update.html',

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
         * @memberOf clients.Modules.a_components.Components.inputPriceUpdate
         */
        function linkFunction(scope, element, attrs) {

            ////////////////////////////////////////////////////////
            // Keep Input Focused
            ////////////////////////////////////////////////////////
            scope.$watch('sortIndex', function(newVal, prevVal) {
                if (scope.focusVar) {
                    $timeout(function() {
                        element.find('input').focus();
                    });
                }
            });

            ////////////////////////////////////////////////////////
            // Message Popup Handling
            ////////////////////////////////////////////////////////
            var priceRequiredId = '#priceRequiredA',
              priceMinId = '#priceMinA',
              priceNumberId = '#priceNumberA',
              popoverIds = [priceRequiredId, priceMinId, priceNumberId];

            popoverIds.forEach(function(id) {
                element.find(id).popover({trigger:'manual'});
            });

            scope.$watch(
              function() { return scope.error; },
              function(newData, oldData) {
                if (!(oldData && oldData.required) && newData && newData.required) {
                    element.find(priceRequiredId).popover('show');
                    element.find(priceMinId)     .popover('hide');
                    element.find(priceNumberId)  .popover('hide');
                } else if (!(oldData && oldData.min) && newData && newData.min) {
                    element.find(priceRequiredId).popover('hide');
                    element.find(priceMinId)     .popover('show');
                    element.find(priceNumberId)  .popover('hide');
                } else if (!(oldData && oldData.number) && newData && newData.number) {
                    element.find(priceRequiredId).popover('hide');
                    element.find(priceMinId)     .popover('hide');
                    element.find(priceNumberId)  .popover('show');
                } else if (newData && !newData.required && !newData.min && !newData.number)
                {
                    element.find(priceRequiredId).popover('hide');
                    element.find(priceMinId)     .popover('hide');
                    element.find(priceNumberId)  .popover('hide');
                }
            },
              true // deep watch
            ); // scope.$watch( ... scope.error )

        } // function linkFunction(...)

    } // function inputPriceUpdate(...)

}());
