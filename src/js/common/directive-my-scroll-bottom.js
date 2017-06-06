/* file: directive-my-scroll-bottom.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .directive('myScrollBottom', ['$timeout', function($timeout) {

    return {
      scope: {
        myScrollBottom: "="
      },
      link: function ($scope, $element) {
        $scope.$watchCollection('myScrollBottom', function (newValue) {
          if (newValue) {
            $timeout(function(){
              $element.scrollTop($element[0].scrollHeight);
            }, 0);
          }
        });
      }
    };

  }]); // .directive('myScrollBottom', ...

})();
