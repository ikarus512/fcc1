/* file: factory-rest.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .factory('RestService',
      ['$http',
      function ($http) {

        return {

            getSettings: function(id) {
                return $http({
                    method: 'GET',
                    data:{},
                    url: '/settings/api/users/' + id
                });
            },

            deleteUser: function(id) {
                return $http({
                    method: 'DELETE',
                    data:{},
                    url: '/settings/api/users/' + id
                });
            },

            postSettings: function (id, settings) {
                return $http({
                    method: 'POST',
                    data: settings,
                    url: '/settings/api/users/' + id
                });
            }

        };

    }]);

}());
