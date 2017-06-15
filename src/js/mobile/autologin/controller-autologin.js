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

      User.check()
      .then( function() {
        $scope.logintype = User.type;
        $scope.username  = User.name;
        $scope.uid       = User.uid;
        console.log('autologin check: ', User.type, User.name, User.uid);
      });

      $scope.login = function() {
        User.loginLocal('me','me')
        .then( function() {
          $scope.logintype = User.type;
          $scope.username  = User.name;
          $scope.uid       = User.uid;
          console.log('autologin login: ', User.type, User.name, User.uid);
        });
      };

    }
  ]); // .controller('ControllerAutologin', ...

})();
