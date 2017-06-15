/* file: factory-login.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('LoginFactory', [
    '$http', 'MyConst',
    function ($http, MyConst) {

      return {

        check: function() {
          return $http({
            method: 'GET',
            data: {},
            url: MyConst.serverUrl + '/auth/api/check'
          });
        },

        loginLocal: function(username, password) {
          return $http({
            method: 'POST',
            data: {username: username, password: password},
            url: MyConst.serverUrl + '/auth/api/local'
          });
        },

      };

    }

  ]); // .factory('LoginFactory', ...

})();
