/* file: factory-websocket.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .factory('App3WebSocketService', [
        'App3RestService', 'MyError', 'MyConst', '$q',
        function App3WebSocketService(App3RestService, MyError, MyConst, $q) {

            var Service = {};
            var ws = null;

            Service.open = serviceOpen;
            Service.subscribe = serviceSubscribe;
            Service.addStockName = serviceAddStockName;
            Service.removeStockName = serviceRemoveStockName;
            Service.close = serviceClose;

            return Service;

            ////////////////////////////////////////

            function serviceOpen() {

                var deferred = $q.defer();

                if (!ws) {

                    ws = new WebSocket(MyConst.webSocketHost);

                    ws.onopen = function(event) {

                        // Get WebSocket ticket
                        App3RestService.getWsTicket()
                        .then(function(data) {
                            var wsTicket =
                                (typeof(data) === 'object' && data.data && data.data.ticket) ?
                                data.data.ticket :
                                '';
                            // Register WebSocket ticket (to be able to receive messages
                            // from server)
                            setTimeout(function() {
                                ws.send(JSON.stringify({
                                    msgtype:'app3-check-ticket',
                                    ticket:wsTicket
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
                        if (Service.callback && data.msgtype === 'app3-stocks-data') {
                            Service.callback(data.data);
                        }
                    };

                }

                return deferred.promise;

            } // function serviceOpen(...)

            function serviceSubscribe(callback) {
                Service.callback = callback;
                return Service.open();
            } // function serviceSubscribe(...)

            function serviceAddStockName(stockName) {
                if (ws) {
                    ws.send(JSON.stringify({msgtype: 'app3-add-stock-name', stockName: stockName}));
                }
            } // function serviceAddStockName(...)

            function serviceRemoveStockName(stockName) {
                if (ws) {
                    ws.send(JSON.stringify({
                        msgtype: 'app3-remove-stock-name',
                        stockName: stockName
                    }));
                }
            } // function serviceRemoveStockName(...)

            function serviceClose() {
                if (ws) {
                    ws.close();
                    ws = null;
                }
            } // function serviceClose(...)

        } // function App3WebSocketService(...)

    ]); // .factory('App3WebSocketService', ...

}());
