/* file: app3-service-websockets.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('WebSocketService', [
    'RestService', 'MyError',
    function(RestService, MyError) {

      var Service = {};

      var HOST = (window.document.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.document.location.host;
      var ws = new WebSocket(HOST);

      // Get WebSocket ticket
      RestService.getWsTicket()
      .then( function(data) {
        var wsTicket = (typeof(data)==='object' && data.data && data.data.ticket) ? data.data.ticket : '';
        // Register WebSocket ticket (to be able to receive messages from server)
        setTimeout( function() {
          ws.send(JSON.stringify({msgtype:'check-ticket',ticket:wsTicket}));
        },1500); // Delay for heroku.com
      })
      .catch( function(res) {
        MyError.alert(res);
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

      Service.addStockName = function(stockName) {
        ws.send(JSON.stringify({msgtype: 'add-stock-name', stockName: stockName}));
      };

      Service.removeStockName = function(stockName) {
        ws.send(JSON.stringify({msgtype: 'remove-stock-name', stockName: stockName}));
      };

      return Service;

  }]); // .factory('WebSocketService', ...

})();
