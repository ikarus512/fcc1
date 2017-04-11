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

      $scope.cafes = [];
      $scope.zoom = 16;
      $scope.center = { lat: 56.312956, lng: 43.989955 }; // Nizhny
      $scope.radius = 188.796;

      $scope.init = function(lat,lng,zoom,radius) {
        lat=Number(lat); lng=Number(lng); zoom=Number(zoom); radius=Number(radius);
        if (isFinite(lat)) $scope.center.lat = lat;
        if (isFinite(lng)) $scope.center.lng = lng;
        if (isFinite(zoom)) $scope.zoom = zoom;
        if (isFinite(radius)) $scope.radius = radius;
        cafesRefresh();
      };

      $scope.cafesUnselect = function() {
        $scope.cafes.forEach( function(cafe) { cafe.show = true; cafe.selected = false; });
      };

      $scope.cafeSelect = function(_id) {
        $scope.cafes.forEach( function(cafe) {
          cafe.show = cafe.selected = false;
          if (cafe._id === _id) {
            cafe.show = cafe.selected = true;
          }
        });
      };

      function cafesRefresh() {
        setTimeout( function() {
          // Find selected cafe
          var oldSelectedCafeId;
          $scope.cafes.forEach( function(cafe) {
            if (cafe.selected) oldSelectedCafeId = cafe._id;
          });

          cafeStorage.get($scope.center, $scope.radius, $scope.zoom)
          .then( function(res) {
            $scope.cafes = [];
            var newCafes = res.data;

            // Check if selected cafe still present among newCafes
            var found = newCafes.some( function(cafe) {
              return (cafe._id === oldSelectedCafeId);
            });

            if (found) {
              newCafes.forEach( function(cafe) {
                // Show only selected cafe
                if (cafe._id === oldSelectedCafeId) {
                  cafe.show = cafe.selected = true;
                } else {
                  cafe.show = cafe.selected = false;
                }
              });
            } else {
              newCafes.forEach( function(cafe) { cafe.show = true; cafe.selected = false; });
            }

            $scope.cafes = newCafes;
          })
          .catch( function(err) {
            // No connection. Do not remove cafes downloaded earlier.
            //$scope.cafes = [];
          });
        },0);
      }

      $scope.mapMoved = function(newOpts) {
        if (newOpts.newCenter) $scope.center = newOpts.newCenter;
        $scope.zoom   = newOpts.newZoom;
        $scope.radius = newOpts.newRadius;
        cafesRefresh();
      };

    }

  ]); // app.controller('myApp2ControllerMain', ...

})();
