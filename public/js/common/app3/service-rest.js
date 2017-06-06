/* file: service-rest.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('RestService', ['$http', function ($http) {
    return {
      getWsTicket: function () {
        return $http({
          method: 'GET',
          data:{},
          url: '/app3/api/get-ws-ticket'
        });
      },

      // post: function (poll) {
      //   return $http({
      //     method: 'POST',
      //     data:poll,
      //     url: '/app1/api/polls'
      //   });
      // },

    };

  }]); // .factory('RestService', ...

})();
