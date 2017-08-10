/* file: factory-websocket.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('app4book')

    .factory('App4WebSocketService', [
        'bookStorage', 'MyError', 'MyConst', '$q',
        function App4WebSocketService(bookStorage, MyError, MyConst, $q) {

            var Service = {};
            var ws = null;

            Service.subscribe = serviceSubscribe;
            Service.sendMessage = serviceSendMessage;
            Service.close = serviceClose;

            return Service;

            ////////////////////////////////////////

            function serviceSubscribe(bookId, uid, callback) {

                var deferred = $q.defer();

                Service.callback = callback;

                // Close WebSocket
                Service.close();

                // Open WebSocket
                ws = new WebSocket(MyConst.webSocketHost);

                ws.onopen = function(event) {

                    // Get WebSocket ticket
                    bookStorage.getWsTicket()

                    .then(function(data) {
                        var ticket =
                            (typeof(data) === 'object' && data.data && data.data.ticket) ?
                            data.data.ticket :
                            '';
                        // Register WebSocket ticket (to be able to receive messages from server)
                        setTimeout(function() {
                            ws.send(JSON.stringify({
                                msgtype: 'app4-check-ticket',
                                bookId: bookId,
                                uid: uid,
                                ticket: ticket
                            }));
                            deferred.resolve(1);
                        },1500); // Delay for heroku.com

                    })

                    .catch(function(res) {
                        deferred.reject(0);
                        MyError.log(res);
                    });

                };

                ws.onerror = function(event) {
                    deferred.reject(0);
                };

                ws.onclose = function(event) {
                    deferred.reject(0);
                };

                ws.onmessage = function(message) {
                    var data = JSON.parse(message.data);
                    Service.callback(data);
                };

                return deferred.promise;

            } // function serviceSubscribe(...)

            function serviceSendMessage(bookId,from,to,time,text) {
                ws.send(JSON.stringify({
                    msgtype: 'app4-message',
                    bookId: bookId,
                    from: from,
                    to: to,
                    time: time,
                    text: text
                }));
            } // function serviceSendMessage(...)

            function serviceClose() {
                if (ws) {
                    ws.close();
                    ws = null;
                }
            } // function serviceClose(...)

        } // function App4WebSocketService(...)

    ]); // .factory('App4WebSocketService', ...

}());
