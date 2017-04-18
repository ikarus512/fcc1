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

    // Get WebSocket ticket
    RestService.getWsTicket()
    .then( function(data) {
      var wsTicket = (typeof(data)==='object' && data.data && data.data.ticket) ? data.data.ticket : '';
      // Register WebSocket ticket (to be able to receive messages from server)
      ws.send(JSON.stringify({msgtype:'check-ticket',ticket:wsTicket}));
    })
    .catch( function(err) {
      if (err && err.data && err.data.message) {
        console.log(err.data.message);
      }
    });

    ws.onmessage = function(message) {
      var data = JSON.parse(message.data);
      if (Service.callback && data.msgtype==='stocks-data') {
        Service.callback(data.data);
      }
    };

    Service.subscribe = function(callback) {
      Service.callback = callback;
    };

    return Service;

  }]); // .factory('WebSocketService', ...

})();
