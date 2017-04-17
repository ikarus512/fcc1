/* file: app3-service-websockets.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myApp3')

  .factory('WebSocketService', ['RestService', function(RestService) {

    var Service = {};

    var HOST = (window.document.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.document.location.host;
    var ws = new WebSocket(HOST);

    ws.onmessage = function(message) {
      var data = JSON.parse(message.data);
      if (Service.callback) Service.callback(data);
    };

    Service.subscribe = function(callback) {
      Service.callback = callback;
    };

    return Service;

  }]); // .factory('WebSocketService', ...

})();
