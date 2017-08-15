/* file: factory-cafe-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('app2')

    .factory('cafeStorage', ['$http', 'MyConst', function cafeStorage($http, MyConst) {
        return {
            get: function getCafe(center, radius, zoom, selectedCafeId) {
                return $http({
                    method: 'GET',
                    url: MyConst.serverUrl + '/app2/api/cafes' +
                      '?lat='     + encodeURIComponent(center.lat) +
                      '&lng='     + encodeURIComponent(center.lng) +
                      '&zoom='    + encodeURIComponent(zoom) +
                      '&radius='  + encodeURIComponent(radius) +
                      '&selectedCafeId=' + encodeURIComponent(selectedCafeId) +
                      ''
                });
            },

            updateSessionState: function updateSessionState(center, radius, zoom, selectedCafeId)
            {
                return $http({
                    method: 'PUT',
                    url: MyConst.serverUrl + '/app2/api/cafes',
                    data: {
                        lat:              encodeURIComponent(center ? center.lat : undefined),
                        lng:              encodeURIComponent(center ? center.lng : undefined),
                        zoom:             encodeURIComponent(zoom),
                        radius:           encodeURIComponent(radius),
                        selectedCafeId:   encodeURIComponent(selectedCafeId)
                    }
                });
            },

            planCafeTimeslot: function planCafeTimeslot(cafeId, timeslotStart) {
                return $http({
                    method: 'PUT',
                    data: {},
                    url:
                        MyConst.serverUrl +
                        '/app2/api/cafes/' +
                        cafeId +
                        '/timeslots/' +
                        encodeURIComponent(timeslotStart.toUTCString()) +
                        '/plan'
                });
            },

            unplanCafeTimeslot: function unplanCafeTimeslot(cafeId, timeslotStart) {
                return $http({
                    method: 'PUT',
                    data: {},
                    url:
                        MyConst.serverUrl +
                        '/app2/api/cafes/' +
                        cafeId +
                        '/timeslots/' +
                        encodeURIComponent(timeslotStart.toUTCString()) +
                        '/unplan'
                });
            }

        };

    }]); // .factory('cafeStorage', ...

}());
