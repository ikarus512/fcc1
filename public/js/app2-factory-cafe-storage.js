/* file: app2-factory-cafe-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  var app = angular.module('myApp2Cafes');

  app.factory('cafeStorage', ['$http', function ($http) {
    return {
      get: function (location, radius) {
        return $http({
          method: 'GET',
          data: {
            lat: location.lat,
            lng: location.lng,
            r: radius,
          },
          url: '/app2/api/cafes'
        });
      },

      post: function (poll) {
        return $http({
          method: 'POST',
          data:poll,
          url: '/app2/api/cafes'
        });
      },

    };

  }]); // app.factory('cafeStorage', ...

})();
