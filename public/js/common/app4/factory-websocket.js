/* file: factory-websocket.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('WebSocketService', [
    'bookStorage', 'MyError',
    function(bookStorage, MyError) {

      var Service = {};

      var HOST = 'wss://' + window.document.location.host;
      var ws = new WebSocket(HOST);

      ws.onmessage = function(message) {
        var data = JSON.parse(message.data);
        Service.callback(data);
      };

      var subscribed;

      Service.subscribe = function(bookId, uid, callback) {

        if (!subscribed) {

          subscribed = true;

          // Get WebSocket ticket
          bookStorage.getWsTicket()

          .then( function(data) {
            var ticket = (typeof(data)==='object' && data.data && data.data.ticket) ? data.data.ticket : '';
            // Register WebSocket ticket (to be able to receive messages from server)
            setTimeout( function() {
              ws.send(JSON.stringify({
                msgtype: 'app4-check-ticket',
                bookId: bookId,
                uid: uid,
                ticket: ticket,
              }));
            },1500); // Delay for heroku.com

            Service.callback = callback;
          })

          .catch( function(res) {
            MyError.log(res);
          });

        } else {

            Service.callback = callback;

        }

      };

      Service.sendMessage = function(bookId,from,to,time,text) {
        ws.send(JSON.stringify({
          msgtype: 'app4-message',
          bookId: bookId,
          from: from,
          to: to,
          time: time,
          text: text,
        }));
      };

      return Service;

  }]); // .factory('WebSocketService', ...

})();
