/* file: controller-autologin.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerAutologin', [
    '$scope', 'User', 'MyConst',
    function ($scope, User, MyConst) {

      $scope.logintype = User.getType();
      $scope.uid = User.getUid();
      $scope.username = User.getName();
      console.log('logged in as: ', User.getType(), User.getName(), User.getUid());

      $scope.login = function() {
        User.loginLocal('me','me')
        .then( function(res) {
          console.log('now logged in as: ', User.getType(), User.getName(), User.getUid());
        });
      };

    }
  ]); // .controller('ControllerAutologin', ...

})();
