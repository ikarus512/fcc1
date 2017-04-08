/* file: app2-controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  var app = angular.module('myApp2Cafes', []);

  app.controller('myApp2ControllerMain', [
    '$scope', 'cafeStorage',
    function($scope, cafeStorage) {

      $scope.cafes = [
        // { lat: 51.508515, lng: -0.125487, name: 'London',    text: 'Just some content'},
        // { lat: 52.370216, lng:  4.895168, name: 'Amsterdam', text: 'More content' },
      ];
      $scope.zoom = 16;
      $scope.center = { lat: 56.312956, lng: 43.989955 }; // Nizhny
      $scope.radius = 500; //{ x1:56.31, y1:43.98, x2:56.31, y2:43.99};

      $scope.cafes = [];
      cafesRefresh();

      function cafesRefresh() {
        cafeStorage.get($scope.center, $scope.radius)
        .then( function(res) {
          $scope.cafes = [];
          $scope.cafes = res.data;
          console.log($scope.cafes);
        })
        .catch( function(err) {
          console.log(err);
          $scope.cafes = [];
        });
      }

      $scope.mapMoved = function(newOpts) {
        $scope.center = newOpts.newCenter;
        $scope.zoom   = newOpts.newZoom;
        $scope.radius = newOpts.newRadius;
        cafesRefresh();
      };

    }

  ]); // app.controller('myApp2ControllerMain', ...

})();
