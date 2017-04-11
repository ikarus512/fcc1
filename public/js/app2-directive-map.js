/* file: app2-directive-map.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  var app = angular.module('myApp2Cafes');

  app.directive('myGoogleMap', function() {

    var scope = {
      cafes: '=mapCafes',
      center: '=mapCenter',
      zoom: '=mapZoom',
      mapMoved: '&',
      cafeSelect: '&',
      cafesUnselect: '&',
    };

    // directive link function
    function directiveLinkFunction(scope, element, attrs) {

      var map, selectedMarker, circle, mapReady = true;

      var mapOptions = {
        center: scope.center,
        zoom: scope.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: true,
        mapTypeControl: true,
        scaleControl: true,
        zoomControl: true,
        disableDoubleClickZoom: true, // we do it manually
      };

      function initMap() {

        if (!map) {
          map = new google.maps.Map(element[0], mapOptions);
          map.addListener('dragend', onMapChangeRefreshScope);
          map.addListener('zoom_changed', onMapChangeRefreshScope);
          map.addListener('center_changed', onMapChangeRefreshScope);
          map.addListener('dblclick', onDblClick);
          map.addListener('click', onClick);
          $(document).on('webkitfullscreenchange mozfullscreenchange msfullscreenchange fullscreenchange', onFullScreen);

          circle = new google.maps.Circle({
            strokeColor: '#FF0000',   strokeOpacity: 0.30,     strokeWeight: 2,
            fillColor: '#00FF00',     fillOpacity: 0.10,
            map: map,
            center: new google.maps.LatLng(scope.center.lat,scope.center.lng),
            radius: scope.radius,
          });
          circle.addListener('dblclick', onDblClick);
          circle.addListener('click', onClick);

          scope.cafes.forEach( function(cafe) {
            addMarker(cafe);
          });

        }

      } // function initMap(...)

      function markerSelect(marker, cafe_id) {
        selectedMarkerDeselect();
        selectedMarker = marker;
        marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');
        scope.$apply( function() {
          scope.cafeSelect(cafe_id);
        });
      } // function markerSelect(...)

      function selectedMarkerDeselect() {
        if (selectedMarker) {
          selectedMarker.setIcon('https://maps.google.com/mapfiles/ms/icons/blue-dot.png');
          selectedMarker = null;
        }
        scope.$apply( function() {
          scope.cafesUnselect();
        });
      } // function selectedMarkerDeselect(...)

      function onClick(MouseEvent) {
        selectedMarkerDeselect();
      }

      function onDblClick(MouseEvent) {
        map.setZoom(map.getZoom()+1);
        setTimeout( function() {
          map.setCenter(MouseEvent.latLng);
          onMapChangeRefreshScope();
        }, 100);
      }

      function onFullScreen() {
        var c = new google.maps.LatLng(scope.center.lat,scope.center.lng);
        setTimeout( function() {
          map.setCenter(c);
          onMapChangeRefreshScope();
        }, 100);
      }

      // Detect current center and bounds, and refresh scope
      function onMapChangeRefreshScope() {

        if (mapReady) {
          mapReady = false;

          setTimeout( function() {
            var z = map.getZoom();
            var c = map.getCenter();
            var r = map.getBounds(); // x1=b.f.f, y1=b.b.b, x2=b.f.b, y2=b.b.f
            if (r) {
              // Get r = 1/2 * min{width,height} of map window:
              var
                pTopLeft     = new google.maps.LatLng(r.f.f, r.b.b),
                pTopRight    = new google.maps.LatLng(r.f.b, r.b.b),
                pBottomLeft  = new google.maps.LatLng(r.f.f, r.b.f),
                pBottomRight = new google.maps.LatLng(r.f.b, r.b.f),
                width  = google.maps.geometry.spherical.computeDistanceBetween(pTopLeft,pTopRight),
                height = google.maps.geometry.spherical.computeDistanceBetween(pTopLeft,pBottomLeft);
              r = Math.min(width,height) * 0.5 * 0.95;
            } else {
              r = 500;
            }

            scope.$apply( function() {
              scope.mapMoved({
                newZoom: z,
                newRadius: r,
                newCenter: {lat:c.lat(),lng:c.lng()},
              });
            });

            circle.setCenter(c);
            circle.setRadius(r);

            mapReady = true;

          },100);
        }
      }

      function removeMarker(cafe) {
        google.maps.event.removeListener(cafe.marker.myMarkerListenerHandle);
        cafe.marker.setMap(null);
        delete cafe.marker;
      } // function removeMarker(...)

      function shiftMarker(position) {
        var shift = Math.pow(2,16-scope.zoom)*0.0001; //0.0001~=20m at zoom 16
        var newPosition = { lat: position.lat-shift, lng: position.lng-shift };
        return newPosition;
      } // function shiftMarker(...)

      function addMarker(cafe) {
        var marker;
        var icon = // cafe.icon ? cafe.icon :
          'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

        var position = { lat: cafe.lat, lng: cafe.lng };

        // Shift position of new marker if it is too close to another marker
        scope.cafes.forEach( function(c) { try {
          if (c.marker && c._id !== cafe._id) {
            var d = google.maps.geometry.spherical.computeDistanceBetween(
              c.marker.position,
              new google.maps.LatLng(position.lat, position.lng)
            );
            if (d<20) { // too close?
              position = shiftMarker(position);
            }
          }
        } catch(err) {} });

        var markerOptions = {
          position: position,
          map: map,
          title: cafe.name,
          icon: icon,
        };

        marker = new google.maps.Marker(markerOptions);
        cafe.marker = marker;


        marker.myMarkerListenerHandle = google.maps.event.addListener(
          marker, 'click', function () {

            markerSelect(marker,cafe._id);

          }
        );

      } // function addMarker()
      
      initMap();

      scope.$watchCollection('cafes', function(newCafes, oldCafes) {

        // Remove old markers
        oldCafes.forEach( function(cafe) {
          if (newCafes.indexOf(cafe)<0) {
            removeMarker(cafe);
          }
        });

        // Add new markers
        newCafes.forEach( function(cafe) {
          if (oldCafes.indexOf(cafe)<0) {
            addMarker(cafe);
          }
        });

      });

    } // function directiveLinkFunction(...)
    
    return {
      restrict: 'E',
      template: '<div id="gmaps"></div>',
      replace: true,
      link: directiveLinkFunction
    };
  });


})();
