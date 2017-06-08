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

      User.loginLocal('me','me')
      .then( function(res) {
        $scope.logintype = User.type;
        $scope.uid = User.uid;
        $scope.username = User.name;
        console.log('logged in as: ', User.type, User.name, User.uid);
      });

    }
  ]); // .controller('ControllerAutologin', ...

})();
