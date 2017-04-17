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

var
  wsStore = require('./web-sockets-store.js'),
  myErrorLog = require('./../../utils/my-error-log.js');

module.exports = function(server) {

  var
    SocketServer = require('ws').Server,
    wss = new SocketServer({server:server});

  wss.on('error', function (e) {
    myErrorLog(null, err);
  });

  wss.on('connection', function(ws) {
    ws.on('close', function() {
    });
  });



  setInterval( function() {
    wss.clients.forEach( function(client) {
      try {
        client.send(
          JSON.stringify({
            items: wsStore.get(),
            time: new Date().toISOString(),
            y: Math.random()*300,
            x: new Date().toISOString(),
          })
        );
      } catch(err) {
        myErrorLog(null, err);
      }
    });
  }, 0.5*1000);

};
