/* file: controller-home.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerHomeMobile', [
    '$scope', '$location', 'User', 'MyConst',
    function ($scope, $location, User, MyConst) {

      User.check()
      .then( function() {
        $scope.logintype = User.type;
        $scope.username  = User.name;
        $scope.uid       = User.uid;
      });

    }
  ]); // .controller('ControllerHomeMobile', ...

})();
