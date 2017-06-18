/* file: directive-map-leaflet.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .directive('myLeafletMap', ['$timeout', 'MyConst', function($timeout, MyConst) {

    var scope = {
      cafes: '=mapCafes',
      selectedCafeId: '=mapSelectedCafeId',
      center: '=mapCenter',
      zoom: '=mapZoom',
      mapMoved: '&',
      onMapInit: '&',
      mapSelectedCafe: '&',
      cafesUnselect: '&',
    };

    // directive link function
    function directiveLinkFunction(scope, element, attrs) {

      var map = null;

      initMap();

      function initMap() {

        scope.goOnline = function() {
          console.log('goOnline()');
        };

        if (!map) {

          var map = L.map(element.find('#leaflet-map-canvas')[0])

          .setView([56.312956, 43.989955], 17);

          L.tileLayer(
            // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            MyConst.urlPref + 'img/OSM5/{z}/{x}/{y}.png', {
              reuseTiles: true,
              updateWhenIdle: false,
              maxZoom: 17,
          }).addTo(map);

        }

      } // function initMap(...)

    } // function directiveLinkFunction(...)

   
    return {
      restrict: 'E',
      template: '<div><button ng-click="goOnline();">Go Online</button><div id="leaflet-map-canvas" style="height:90%;width:100%;"></div></div>',
      replace: true,
      scope: scope,
      link: directiveLinkFunction
    };
  }]);


})();
