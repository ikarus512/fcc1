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
    };

    // directive link function
    function directiveLinkFunction(scope, element, attrs) {
      var map, infoWindow;

      var mapOptions = {
        center: scope.center,
        zoom: scope.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: true,
        mapTypeControl: true,
        scaleControl: true,
        zoomControl: true,
      };

      function initMap() {
        if (!map) {
          map = new google.maps.Map(element[0], mapOptions);
          map.addListener('dragend', onMapMoved);
          map.addListener('zoom_changed', onMapMoved);
        }
      }    

      function onMapMoved() {
        var z = map.getZoom();
        var c = map.getCenter();
        var r = map.getBounds(); // x1=b.f.f, y1=b.b.b, x2=b.f.b, y2=b.b.f
        if (r) {
          var p1 = new google.maps.LatLng(r.f.f, r.b.b);
          var p2 = new google.maps.LatLng(r.f.b, r.b.f);
          r = google.maps.geometry.spherical.computeDistanceBetween(p1,p2) / 2;
        } else {
          r = 500;
        }
        scope.$apply(function() {
          scope.mapMoved({
            newZoom: z,
            newCenter: {lat:c.lat(),lng:c.lng()},
            newRadius: r,
          });
        });
      }

      function removeMarker(cafe) {
        google.maps.event.removeListener(cafe.marker.myMarkerListenerHandle);
        cafe.marker.setMap(null);
        delete cafe.marker;
      }

      function addMarker(cafe) {
        var marker;
        var icon = // cafe.icon ? cafe.icon :
          'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        var markerOptions = {
          position: { lat: cafe.lat, lng: cafe.lng },
          map: map,
          title: cafe.name,
          icon: icon,
        };

        marker = new google.maps.Marker(markerOptions);
        cafe.marker = marker;
        
        marker.myMarkerListenerHandle = google.maps.event.addListener(
          marker, 'click', function () {
            // close window if exists
            if (infoWindow) infoWindow.close();

            // create new window
            var infoWindowOptions = {
                content: cafe.text
            };
            infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            infoWindow.open(map, marker);
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

      scope.cafes.forEach( function(cafe) {
        addMarker(cafe);
      });

    } // function directiveLinkFunction()
    
    return {
      restrict: 'E',
      template: '<div id="gmaps"></div>',
      replace: true,
      link: directiveLinkFunction
    };
  });


})();
