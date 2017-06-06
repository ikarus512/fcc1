/* file: controller.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ctrSettings', [
    '$scope', '$window', 'RestService', 'MyError',
    function ($scope, $window, RestService, MyError) {

      $scope.settings = {};
      $scope.newSettings = {};

      settingsRefresh();

      function settingsRefresh() {

        if ($scope.uid) {

          RestService.getSettings($scope.uid)

          .then( function(res) {
            $scope.settings = res.data;
            $scope.cancelChanges(); // reset newSettings = settings
          })

          .catch( function(res) { MyError.alert(res); } );

        }

      }

      $scope.init = function(logintype,uid) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
        $scope.uid = uid==='undefined' ? '' : uid;
        settingsRefresh();
      };

      $scope.deleteUser = function() {

        if (confirm('Do you really want to delete the user?')) {

          RestService.deleteUser($scope.uid)

          .then( function(res) {
            $window.location.href = '/'; // return to home page
          })

          .catch( function(res) {
            MyError.alert(res);
          });

        }

      };

      $scope.cancelChanges = function() {
        $scope.newSettings = {};
        $scope.newSettings.fullName = $scope.settings.fullName;
        $scope.newSettings.city     = $scope.settings.city;
        $scope.newSettings.state    = $scope.settings.state;
        $scope.newSettings.country  = $scope.settings.country;
      };

      $scope.saveChanges = function() {

        $scope.newSettings.fullName = String($scope.newSettings.fullName).trim();
        $scope.newSettings.city     = String($scope.newSettings.city).trim();
        $scope.newSettings.state    = String($scope.newSettings.state).trim();
        $scope.newSettings.country  = String($scope.newSettings.country).trim();

        RestService.postSettings($scope.uid, $scope.newSettings)

        .then( function(res) {
          settingsRefresh();
        })

        .catch( function(res) {
          MyError.alert(res);
        });

      }; // $scope.saveChanges = function(...)

  }]); // .controller('myApp4Controller', ...

})();
