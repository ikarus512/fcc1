/* file: controller-autologin.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerAutologin', [
    '$scope', 'StorageAutologin', 'MyConst',
    function ($scope, StorageAutologin, MyConst) {

      StorageAutologin.loginLocal('me','me')
      .then( function(res) {
        $scope.logintype = res.data.type;
        $scope.loginname = res.data.name;
      });

    }
  ]); // app.controller('ControllerPolls', ...

})();
