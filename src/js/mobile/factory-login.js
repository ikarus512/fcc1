/* file: factory-login.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .factory('LoginFactory', [
        '$http', 'MyConst',
        function LoginFactory($http, MyConst) {

            return {

                check: function check() {
                    return $http({
                        method: 'GET',
                        data: {},
                        url: MyConst.serverUrl + '/auth/api/check'
                    });
                },

                loginLocal: function loginLocal(username, password) {
                    return $http({
                        method: 'POST',
                        data: {username: username, password: password},
                        url: MyConst.serverUrl + '/auth/api/local'
                    });
                }

            };

        } // function LoginFactory(...)

    ]); // .factory('LoginFactory', ...

}());
