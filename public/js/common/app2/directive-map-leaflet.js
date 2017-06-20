/* file: directive-map-leaflet.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .directive('myLeafletMap', ['MyConst', function(MyConst) {

    var
      maxZoom = 17,

      scope = {
        cafes: '=mapCafes',
        selectedCafeId: '=mapSelectedCafeId',
        center: '=mapCenter',
        zoom: '=mapZoom',

        mapMoved: '=',
        onMapInit: '=',
        mapSelectedCafe: '=',
        cafesUnselect: '=',
      },

      layerOffline = L.tileLayer(
        MyConst.urlPref + 'img/OSM5/{z}/{x}/{y}.png', {
          reuseTiles: true,
          updateWhenIdle: false,
          maxZoom: maxZoom,
      }),

      layerOnline = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          reuseTiles: true,
          updateWhenIdle: false,
          maxZoom: maxZoom,
      }),

      iconBlue = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),

      iconRed = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });


    // directive link function
    function directiveLinkFunction(scope, element, attrs) {

      var map, selectedMarker, circle, mapInit = false, mapReadyFlag = true, markers = {};

      var mapOptions = {
        center: scope.center, // L.LatLng(scope.center.lat, scope.center.lng),
        zoom: scope.zoom,
        attributionControl: false, // no link to leaflet
        zoomControl: true,
        doubleClickZoom: false, // we do it manually
        layers: [layerOffline],
      };

      //////////////////////////////////////////////////////////
      // toggle layer
      //////////////////////////////////////////////////////////
      scope.nextLayerName = 'go online';
      scope.toggleLayer = function() {
        if (map) {
          if (map.hasLayer(layerOffline)) {
            scope.nextLayerName = 'go offline';
            map.removeLayer(layerOffline);
            map.addLayer(layerOnline);
          } else {
            scope.nextLayerName = 'go online';
            map.removeLayer(layerOnline);
            map.addLayer(layerOffline);
          }
        }
      }; // scope.toggleLayer = function(...)

      //////////////////////////////////////////////////////////
      // toggle fullscreen
      //////////////////////////////////////////////////////////
      var
        fullscreen = false,
        mainElem = angular.element(element[0]),
        // mapElem = angular.element(element.find('#leaflet-map-canvas')[0]),
        el = mainElem,
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
          onFullScreen();
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
          onFullScreen();
        }
        fullscreen = !fullscreen;
      }; // scope.toggleFullscreen = function(...)

      //////////////////////////////////////////////////////////
      // initMap
      //////////////////////////////////////////////////////////
      function initMap() {

        if (!map) {

          map = L.map(element.find('#leaflet-map-canvas')[0], mapOptions);
          map.on('zoomend moveend', onMapChangeRefreshScope); //'dragend zoom_changed center_changed'
          map.on('dblclick', onDblClick);
          map.on('click', onClick);
          //onFullScreen() called manually
          map.eachLayer(function(layer){ // When map first time loaded
            layer.on('load', function(e) {
              if (!mapInit) {
                mapInit = true;
                setTimeout( function() {
                  scope.onMapInit();
                },100);
                onMapChangeRefreshScope();
              }
              layer.off('load');
            });
          });


          circle = L.circle(scope.center,{
            color: '#FF0000',   opacity: 0.30,     weight: 2,
            fillColor: '#00FF00',     fillOpacity: 0.10,
            radius: scope.radius ? scope.radius : 10000,
          }).addTo(map);
          circle.on('dblclick', onDblClick);
          circle.on('click', onClick);


          scope.cafes.forEach( function(cafe) {
            addMarker(cafe);
          });

        }

      } // function initMap(...)

      function markerSelect(marker, cafe_id, scopeApply) {
        selectedMarkerDeselect();
        selectedMarker = marker;
        marker.setIcon(iconRed);
        if (scopeApply) {
          scope.$apply( function() {
            scope.mapSelectedCafe(cafe_id);
          });
        }
      } // function markerSelect(...)

      function selectedMarkerDeselect() {
        if (selectedMarker) {
          selectedMarker.setIcon(iconBlue);
          selectedMarker = null;
        }
      } // function selectedMarkerDeselect(...)

      function onClick(MouseEvent) {
        selectedMarkerDeselect();
        scope.$apply( function() {
          scope.cafesUnselect();
        });
      }

      function onDblClick(MouseEvent) {
        var z = map.getZoom();
        z = (z<maxZoom) ? (z+1) : z;
        setTimeout( function() {
          map.flyTo(MouseEvent.latlng, z); //map.setCenter
          onMapChangeRefreshScope();
        }, 0);
      }

      function onFullScreen() {
        setTimeout( function() {
          map.invalidateSize();
          map.panTo(scope.center); //map.setCenter
          onMapChangeRefreshScope();
        }, 100);
      }

      // Detect current center and bounds, and refresh scope
      function onMapChangeRefreshScope() {

        if (mapReadyFlag) {
          mapReadyFlag = false;

          setTimeout( function() {
            var z = map.getZoom();
            var c = map.getCenter();
            var r = map.getBounds(); // x1=b.f.f, y1=b.b.b, x2=b.f.b, y2=b.b.f
            if (r) {
              // Get r = 1/2 * min{width,height} of map window:
              var
                pTopLeft     = r.getNorthWest(),
                pTopRight    = r.getNorthEast(),
                pBottomLeft  = r.getSouthWest(),
                width  = map.distance(pTopLeft,pTopRight),
                height = map.distance(pTopLeft,pBottomLeft);
              r = Math.min(width,height) * 0.5 * 0.95;
            } else {
              r = 500;
            }

            scope.$apply( function() {
              scope.mapMoved({
                newZoom: z,
                newRadius: r,
                newCenter: c,
              });
            });

            circle.setLatLng(c); //circle.setCenter
            circle.setRadius(r);

            mapReadyFlag = true;

          }, 500); // Slow down map refresh (and hence
                   // lower server load by refresh requests)
        }
      } // function onMapChangeRefreshScope(...)

      function removeMarker(cafe) {
        var marker = markers[cafe._id];

        if (marker === selectedMarker) {
          selectedMarkerDeselect();
        }

        marker.off('click');
        marker.removeFrom(map);
        delete markers[cafe._id]; marker = null;
      } // function removeMarker(...)

      function shiftMarker(position) {
        var shift = Math.pow(2,16-scope.zoom)*0.0001; //0.0001~=20m at zoom 16
        var newPosition = { lat: position.lat-shift, lng: position.lng-shift };
        return newPosition;
      } // function shiftMarker(...)

      function addMarker(cafe) {
        var marker;
        // var icon = // cafe.icon ? cafe.icon :
        //   'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

        var position = { lat: cafe.lat, lng: cafe.lng };

        // Shift position of new marker if it is too close to another marker
        scope.cafes.forEach( function(c) { try {
          var marker = markers[c._id]; // Marker corresponding to cafe c
          if (marker && c._id !== cafe._id) {
            var d = map.distance(marker.getLatLng(),position);
            if (d<20) { // too close?
              position = shiftMarker(position);
            }
          }
          marker = null;
        } catch(err) {} });


        var markerOptions = {
          title: cafe.name,
          icon: iconBlue,
        };

        marker = L.marker(position, markerOptions);
        marker.addTo(map);

        marker.on('click', function markerOnClick() {
          var marker = markers[cafe._id];
          markerSelect(marker,cafe._id,true);
        });

        markers[cafe._id] = marker;

      } // function addMarker()

      initMap();

      scope.$watchCollection('cafes', function(newCafes, oldCafes) {

        // Remove old markers
        oldCafes.forEach( function(oldCafe) {
          var found = newCafes.some( function(newCafe) {
            return (newCafe._id === oldCafe._id);
          });
          if (!found) {
            removeMarker(oldCafe);
          }
        });

        // Add new markers
        newCafes.forEach( function(newCafe) {
          var found = oldCafes.some( function(oldCafe) {
            return (newCafe._id === oldCafe._id);
          });
          if (!found) {
            addMarker(newCafe);
          }
        });

      }); // scope.$watchCollection('cafes',...)

      scope.$watch('selectedCafeId', function(id) {
        // Select marker of selected cafe if any
        if (!id || id==='undefined') {
          selectedMarkerDeselect();
        } else {
          scope.cafes.some( function(cafe) {
            if (cafe.selected) {
              var marker = markers[cafe._id];
              markerSelect(marker,cafe._id,false);
              return true;
            }
            return false;
          });
        }

      }); // scope.$watch('selectedCafeId',...)

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
