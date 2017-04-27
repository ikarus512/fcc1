/* file: app2-factory-cafe-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('cafeStorage', ['$http', function ($http) {
    return {
      get: function(location, radius, zoom, selectedCafeId) {
        return $http({
          method: 'GET',
          url: '/app2/api/cafes' +
            '?lat='     + encodeURIComponent(location.lat) +
            '&lng='     + encodeURIComponent(location.lng) +
            '&zoom='    + encodeURIComponent(zoom) +
            '&radius='  + encodeURIComponent(radius) +
            '&selected_cafe_id=' + encodeURIComponent(selectedCafeId) +
            ''
        });
      },

      updateSessionState: function(location, radius, zoom, selectedCafeId) {
        return $http({
          method: 'PUT',
          url: '/app2/api/cafes' +
            '?lat='     + encodeURIComponent(location?location.lat:undefined) +
            '&lng='     + encodeURIComponent(location?location.lng:undefined) +
            '&zoom='    + encodeURIComponent(zoom) +
            '&radius='  + encodeURIComponent(radius) +
            '&selected_cafe_id=' + encodeURIComponent(selectedCafeId) +
            ''
        });
      },

      planCafeTimeslot: function(cafeId, timeslotStart) {
        return $http({
          method: 'PUT',
          data: {},
          url: '/app2/api/cafes/'+cafeId+'/timeslots/'+encodeURIComponent(timeslotStart.toUTCString())+'/plan'
        });
      },

      unplanCafeTimeslot: function(cafeId, timeslotStart) {
        return $http({
          method: 'PUT',
          data: {},
          url: '/app2/api/cafes/'+cafeId+'/timeslots/'+encodeURIComponent(timeslotStart.toUTCString())+'/unplan'
        });
      },

    };

  }]); // app.factory('cafeStorage', ...

})();
