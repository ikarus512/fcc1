/* file: factory-myRouteParams.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('MyRouteParams', [
    '$routeParams',
    function($routeParams) {

      return {
        pollId: $routeParams.pollId,
        bookId: $routeParams.bookId,
      };

    }
  ]); // .factory('MyRouteParams', ...

})();
