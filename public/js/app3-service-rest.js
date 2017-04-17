/* file: app3-service-rest.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myApp3')

  .factory('RestService', ['$http', function ($http) {
    return {
      get: function () {
        return $http({
          method: 'GET',
          data:{},
          url: '/app1/api/polls'
        });
      },

      post: function (poll) {
        return $http({
          method: 'POST',
          data:poll,
          url: '/app1/api/polls'
        });
      },

    };

  }]); // .factory('RestService', ...

})();
