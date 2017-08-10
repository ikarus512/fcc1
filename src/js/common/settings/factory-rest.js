/* file: factory-rest.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('settings')

    .factory('RestService',
        ['$http',
        function RestService($http) {

            return {

                getSettings: function getSettings(id) {
                    return $http({
                        method: 'GET',
                        data:{},
                        url: '/settings/api/users/' + id
                    });
                },

                deleteUser: function deleteUser(id) {
                    return $http({
                        method: 'DELETE',
                        data:{},
                        url: '/settings/api/users/' + id
                    });
                },

                postSettings: function postSettings(id, settings) {
                    return $http({
                        method: 'POST',
                        data: settings,
                        url: '/settings/api/users/' + id
                    });
                }

            };

        } // function RestService(...)

    ]); // .factory('RestService', ...

}());
