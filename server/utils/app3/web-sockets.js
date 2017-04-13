/* file: web-sockets.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App3 Web Sockets Service
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

module.exports = function(server) {

  var
    SocketServer = require('ws').Server,
    wss = new SocketServer({server:server});

  wss.on('connection', function(ws) {
    console.log('Client connected');
    ws.on('close', function() { console.log('Client disconnected'); });
  });

  setInterval( function() {
    wss.clients.forEach( function(client) {
      client.send(new Date().toTimeString());
    });
  }, 1000);

};
