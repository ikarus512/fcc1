/* file: factory-websocket.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('App3WebSocketService', [
    'App3RestService', 'MyError', 'MyConst',
    function(App3RestService, MyError, MyConst) {

      var Service = {};

      var ws = new WebSocket(MyConst.webSocketHost);

      // Get WebSocket ticket
      App3RestService.getWsTicket()
      .then( function(data) {
        var wsTicket = (typeof(data)==='object' && data.data && data.data.ticket) ? data.data.ticket : '';
        // Register WebSocket ticket (to be able to receive messages from server)
        setTimeout( function() {
          ws.send(JSON.stringify({msgtype:'app3-check-ticket',ticket:wsTicket}));
        },1500); // Delay for heroku.com
      })
      .catch( function(res) {
        MyError.log(res);
      });

      ws.onmessage = function(message) {
        var data = JSON.parse(message.data);
        if (Service.callback && data.msgtype==='app3-stocks-data') {
          Service.callback(data.data);
        }
      };

      Service.subscribe = function(callback) {
        Service.callback = callback;
      };

      Service.addStockName = function(stockName) {
        ws.send(JSON.stringify({msgtype: 'app3-add-stock-name', stockName: stockName}));
      };

      Service.removeStockName = function(stockName) {
        ws.send(JSON.stringify({msgtype: 'app3-remove-stock-name', stockName: stockName}));
      };

      return Service;

  }]); // .factory('App3WebSocketService', ...

})();
