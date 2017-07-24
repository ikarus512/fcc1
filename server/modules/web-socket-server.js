/* file: web-socket-server.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Web Socket Server
 * AUTHOR: ikarus512
 * CREATED: 2017/05/11
 *
 * MODIFICATION HISTORY
 *  2017/05/11, ikarus512. Web socket server formed as module.
 *
 */

/*jshint node: true*/
'use strict';

var
  myErrorLog = require('./../utils/my-error-log.js'),
  SocketServer = require('ws').Server,
  wss,
  handlers = {onMessage: {}, onClose: []};

module.exports = {

    init: function(server) {

        if (!wss) { wss = new SocketServer({server:server}); }

        wss.on('error', function (err) {
            myErrorLog(null, err);
        });

        wss.on('connection', function(ws) {

            ws.on('message', function(msg) {
                try {
                    var data = JSON.parse(msg);
                    if (data.msgtype && (data.msgtype in handlers.onMessage)) {
                        handlers.onMessage[data.msgtype](ws,data);
                    }
                } catch (err) {
                    myErrorLog(null, err);
                }
            });

            ws.on('close', function() {
                try {
                    handlers.onClose.forEach(function(func) {
                        func(ws);
                    });
                } catch (err) {
                    myErrorLog(null, err);
                }
            });

        });

    }, // init: function(...)

    // Register message handlers
    registerHandlers: function(obj) {
        if (typeof(obj) !== 'object') { return; }

        for (var msg in obj) {
            if (typeof(obj[msg]) === 'function') {
                if (msg === 'onClose') {
                    handlers.onClose.push(obj[msg]);
                } else {
                    handlers.onMessage[msg] = obj[msg];
                }
            }
        }
    }, // registerHandlers: function(...)

    // Register one message handler
    onMessage: function(msg, func) {
        if (typeof(msg) === 'string' && typeof(func) === 'function') {
            // register one handler
            handlers.onMessage[msg] = func;
        }
    }, // onMessage: function(...)

    // Register onClose handler
    onClose: function(func) {
        if (typeof(func) === 'function') {
            handlers.onClose.push(func);
        }
    } // onClose: function(...)

};
