/*! Copyright 2017 ikarus512 https://github.com/ikarus512/fcc1.git */!function(){"use strict";angular.module("myapp").directive("myLeafletMap",["MyConst",function(e){function n(e,n,t){function r(n,o,t){f(),v=n,n.setIcon(l),t&&e.$apply(function(){e.mapSelectedCafe(o)})}function f(){v&&(v.setIcon(a),v=null)}function u(n){f(),e.$apply(function(){e.cafesUnselect()})}function s(e){var n=y.getZoom();n=n<o?n+1:n,setTimeout(function(){y.flyTo(e.latlng,n),m()},0)}function d(){setTimeout(function(){y.invalidateSize(),y.panTo(e.center),m()},100)}function m(){C&&(C=!1,setTimeout(function(){var n=y.getZoom(),o=y.getCenter(),t=y.getBounds();if(t){var i=t.getNorthWest(),c=t.getNorthEast(),a=t.getSouthWest(),l=y.distance(i,c),r=y.distance(i,a);t=.5*Math.min(l,r)*.95}else t=500;e.$apply(function(){e.mapMoved({newZoom:n,newRadius:t,newCenter:o})}),_.setLatLng(o),_.setRadius(t),C=!0},500))}function p(e){var n=x[e._id];n===v&&f(),n.off("click"),n.removeFrom(y),delete x[e._id],n=null}function g(n){var o=1e-4*Math.pow(2,16-e.zoom);return{lat:n.lat-o,lng:n.lng-o}}function h(n){var o,t={lat:n.lat,lng:n.lng};e.cafes.forEach(function(e){try{var o=x[e._id];o&&e._id!==n._id&&y.distance(o.getLatLng(),t)<20&&(t=g(t)),o=null}catch(e){}});var i={title:n.name,icon:a};(o=L.marker(t,i)).addTo(y),o.on("click",function(){r(x[n._id],n._id,!0)}),x[n._id]=o}var y,v,_,z=!1,C=!0,x={},I={center:e.center,zoom:e.zoom,attributionControl:!1,zoomControl:!0,doubleClickZoom:!1,layers:[i]};e.nextLayerName="go online",e.toggleLayer=function(){y&&(y.hasLayer(i)?(e.nextLayerName="go offline",y.removeLayer(i),y.addLayer(c)):(e.nextLayerName="go online",y.removeLayer(c),y.addLayer(i)))};var w=!1,T=angular.element(n[0]),k={position:T.css("position"),left:T.css("left"),top:T.css("top"),height:T.css("height"),width:"100%","z-index":T.css("z-index")};e.fullscreenIcon="zoom_out_map",e.toggleFullscreen=function(){w?(e.fullscreenIcon="zoom_out_map",T.css(k),angular.element("body").css({overflow:"auto"}),d()):(e.fullscreenIcon="fullscreen_exit",T.css({position:"fixed",left:0,top:0,height:"100%",width:"100%","z-index":1500}),angular.element("body").css({overflow:"hidden"}),d()),w=!w},function(){y||((y=L.map(n.find("#leaflet-map-canvas")[0],I)).on("zoomend moveend",m),y.on("dblclick",s),y.on("click",u),y.eachLayer(function(n){n.on("load",function(o){z||(z=!0,setTimeout(function(){e.onMapInit()},100),m()),n.off("load")})}),(_=L.circle(e.center,{color:"#FF0000",opacity:.3,weight:2,fillColor:"#00FF00",fillOpacity:.1,radius:e.radius?e.radius:1e4}).addTo(y)).on("dblclick",s),_.on("click",u),e.cafes.forEach(function(e){h(e)}))}(),e.$watchCollection("cafes",function(e,n){n.forEach(function(n){e.some(function(e){return e._id===n._id})||p(n)}),e.forEach(function(e){n.some(function(n){return e._id===n._id})||h(e)})}),e.$watch("selectedCafeId",function(n){n&&"undefined"!==n?e.cafes.some(function(e){return!!e.selected&&(r(x[e._id],e._id,!1),!0)}):f()})}var o=17,t={cafes:"=mapCafes",selectedCafeId:"=mapSelectedCafeId",center:"=mapCenter",zoom:"=mapZoom",mapMoved:"=",onMapInit:"=",mapSelectedCafe:"=",cafesUnselect:"="},i=L.tileLayer(e.urlPref+"img/OSM5/{z}/{x}/{y}.png",{reuseTiles:!0,updateWhenIdle:!1,maxZoom:o}),c=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{reuseTiles:!0,updateWhenIdle:!1,maxZoom:o}),a=L.icon({iconUrl:e.urlPref+"img/app2/blue-dot.png",iconSize:[30,30],iconAnchor:[15,30]}),l=(L.icon({iconUrl:e.urlPref+"img/app2/green-dot.png",iconSize:[30,30],iconAnchor:[15,30]}),L.icon({iconUrl:e.urlPref+"img/app2/red-dot.png",iconSize:[30,30],iconAnchor:[15,30]}));return{restrict:"E",templateUrl:e.urlPref+"js/common/app2/directive-map-leaflet.html",replace:!0,scope:t,link:n}}])}();