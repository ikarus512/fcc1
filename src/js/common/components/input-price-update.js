/* file: input-price-update.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 *  @ngdoc component
 *  @memberof myapp
 *  @name input-price-update
 *  @restrict E
 *  @description
 *      Ajax loader spinner
 *
 *  @attr {String} placeholder
 *  @attr {String} name
 *  @attr {String} error
 *  @attr {String} ng-model
 *  @attr {String} my-enter
 *  @attr {String} my-focus
 *  @attr {String} start-index
 *  @example
 *
 *  Example:
 *      <input-price-update
 *          placeholder='\'Bid Price\''
 *          name='price{{bid._id}}'
 *          error='updateBidForm[\'price\'+bid._id].$error'
 *          ng-model='bid.updateBidPrice'
 *          my-enter='updateBid(updateBidForm[\'price\'+bid._id].$valid, '+
 *           'bid.price, bid.updateBidPrice)'
 *          my-focus='bid.focusMe'
 *          sort-index='{{$index}}'
 *      >
 *      </input-price-update>
 *
 */
(function() {
    'use strict';

    angular.module('myapp')

    .directive('inputPriceUpdate', [
        '$timeout', 'MyConst',
        function inputPriceUpdate($timeout,  MyConst) {

            return {

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

                templateUrl: MyConst.urlPref + 'js/common/components/input-price-update.html',

                link: function linkFunction(scope, element, attrs) {

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

                } // link: function linkFunction(...)

            };

        } // function inputPriceUpdate(...)
    ]); // .directive('inputPriceUpdate', ...

}());
