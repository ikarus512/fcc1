/* file: factory-storage-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('StoragePolls', ['$http', 'MyConst', function ($http, MyConst) {
    return {
      loginLocal: function(username, password) {
        return $http({
          method: 'POST',
          data: {username: username, password: password},
          url: MyConst.serverUrl + '/auth/api/local'
        });
      },

      get: function () {
        return $http({
          method: 'GET',
          data:{},
          url: MyConst.serverUrl + '/app1/api/polls'
        });
      },

      post: function (poll) {
        return $http({
          method: 'POST',
          data:poll,
          url: MyConst.serverUrl + '/app1/api/polls'
        });
      },

    };

  }]); // app.factory('StoragePolls', ...

})();
