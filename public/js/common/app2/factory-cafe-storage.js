/* file: factory-cafe-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('cafeStorage', ['$http', 'MyConst', function ($http, MyConst) {
    return {
      get: function(location, radius, zoom, selectedCafeId) {
        return $http({
          method: 'GET',
          url: MyConst.serverUrl + '/app2/api/cafes' +
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
          url: MyConst.serverUrl + '/app2/api/cafes' +
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
          url: MyConst.serverUrl + '/app2/api/cafes/'+cafeId+'/timeslots/'+encodeURIComponent(timeslotStart.toUTCString())+'/plan'
        });
      },

      unplanCafeTimeslot: function(cafeId, timeslotStart) {
        return $http({
          method: 'PUT',
          data: {},
          url: MyConst.serverUrl + '/app2/api/cafes/'+cafeId+'/timeslots/'+encodeURIComponent(timeslotStart.toUTCString())+'/unplan'
        });
      },

    };

  }]); // .factory('cafeStorage', ...

})();
