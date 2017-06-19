/* file: directive-map-leaflet.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .directive('myLeafletMap', ['MyConst', function(MyConst) {

    var layerOffline = L.tileLayer(
      // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      MyConst.urlPref + 'img/OSM5/{z}/{x}/{y}.png', {
        reuseTiles: true,
        updateWhenIdle: false,
        maxZoom: 17,
    }); //.addTo(map);
    var layerOnline = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // MyConst.urlPref + 'img/OSM5/{z}/{x}/{y}.png', {
        reuseTiles: true,
        updateWhenIdle: false,
        maxZoom: 17,
    }); //.addTo(map);


    var scope = {
      cafes: '=mapCafes',
      selectedCafeId: '=mapSelectedCafeId',
      center: '=mapCenter',
      zoom: '=mapZoom',

      mapMoved: '=',
      onMapInit: '=',
      mapSelectedCafe: '=',
      cafesUnselect: '=',
    };

    // directive link function
    function directiveLinkFunction(scope, element, attrs) {

      var map = null;

      var mapOptions = {
        center: scope.center, // L.LatLng(scope.center.lat, scope.center.lng),
        zoom: scope.zoom,
        attributionControl: false, // no link to leaflet
        zoomControl: true,
        doubleClickZoom: false, // we do it manually
        layers: [layerOffline],
      };

      initMap();

      function initMap() {
        var
          mainElem = angular.element(element[0]),
          mapElem = angular.element(element.find('#leaflet-map-canvas')[0]);

        scope.nextLayerName = 'go online';
        scope.toggleLayer = function() {
          if (map && map.hasLayer(layerOffline)) {
            scope.nextLayerName = 'go offline';
            map.removeLayer(layerOffline);
            map.addLayer(layerOnline);
          } else {
            scope.nextLayerName = 'go online';
            map.removeLayer(layerOnline);
            map.addLayer(layerOffline);
          }
        }; // scope.toggleLayer = function(...)

        var
          fullscreen = false,
          curOpts = {},
          el = mainElem;
        curOpts = {
          position: el.css('position'),
          left:     el.css('left'),
          top:      el.css('top'),
          height:   el.css('height'),
          width:    '100%', //el.css('width'),
          'z-index':el.css('z-index'),
        };
        scope.fullscreenIcon = 'zoom_out_map';
        scope.toggleFullscreen = function() {
          if (fullscreen) {
            // Here if current map mode is fullscreen.
            // Going to small screen.
            scope.fullscreenIcon = 'zoom_out_map';
            el.css(curOpts);
            angular.element('body').css({overflow:'auto'});
          } else {
            // Here if current map mode: small screen.
            // Going to fullscreen.
            scope.fullscreenIcon = 'fullscreen_exit';
            el.css({
              position:'fixed',
              left:  0,
              top:   0,
              height:'100%',
              width: '100%',
              'z-index':1500,
            });
            angular.element('body').css({overflow:'hidden'});
          }
          fullscreen = !fullscreen;
        }; // scope.toggleFullscreen = function(...)

        if (!map) {

          map = L.map(element.find('#leaflet-map-canvas')[0], mapOptions);

          // .setView([56.312956, 43.989955], 17);

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
      templateUrl: MyConst.urlPref + 'js/common/app2/directive-map-leaflet.html',
      replace: true,
      scope: scope,
      link: directiveLinkFunction,
    };
  }]);


})();
