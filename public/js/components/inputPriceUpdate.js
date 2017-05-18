/* file: inputPriceUpdate.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('mycomp', []);

  angular.module('mycomp')

  .directive('inputPriceUpdate', function() {

    return {

      restrict: 'E',

      scope: {
        placeholder: '=',
        name: '@',
        error: '=',
        ngModel: '=',
        myFocus: '=',
        myEnter: '&',
      },

      templateUrl: '/js/components/inputPriceUpdate.html',

      link: function(scope, element, attrs) {

        var priceRequiredId = '#priceRequiredA',
          priceMinId = '#priceMinA',
          priceNumberId = '#priceNumberA',
          popoverIds = [priceRequiredId, priceMinId, priceNumberId];

        popoverIds.forEach( function(id) {
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
            } else if (newData && !newData.required && !newData.min && !newData.number) {
              element.find(priceRequiredId).popover('hide');
              element.find(priceMinId)     .popover('hide');
              element.find(priceNumberId)  .popover('hide');
            }
          },
          true // deep watch
        ); // scope.$watch( ... scope.error )

      }, // link: function(...)

    };

  }); // .directive('inputPriceUpdate', ...

})();
