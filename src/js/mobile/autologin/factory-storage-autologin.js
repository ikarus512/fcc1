/* file: factory-storage-autologin.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('StorageAutologin', ['$http', 'MyConst', function ($http, MyConst) {
    return {
      loginLocal: function(username, password) {
        return $http({
          method: 'POST',
          data: {username: username, password: password},
          url: MyConst.serverUrl + '/auth/api/local'
        });
      },
    };

  }]); // app.factory('StoragePolls', ...

})();
