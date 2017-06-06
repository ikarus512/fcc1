/* file: service-storage-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('StoragePolls', ['$http', function ($http) {
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

  }]); // app.factory('StoragePolls', ...

})();
