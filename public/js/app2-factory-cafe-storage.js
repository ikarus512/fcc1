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
      get: function (location, radius, zoom) {
        return $http({
          method: 'GET',
          url: '/app2/api/cafes' +
            '?lat='     + encodeURIComponent(location.lat) +
            '&lng='     + encodeURIComponent(location.lng) +
            '&zoom='    + encodeURIComponent(zoom) +
            '&radius='  + encodeURIComponent(radius)
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
