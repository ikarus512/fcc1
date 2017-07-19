/* file: stop.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Service to Stop Server
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

var
  io = require('socket.io-client'),
  appUrl = require('./config/app-url.js'),
  socketClient = io.connect(appUrl);

socketClient.on('connect', function() {
    socketClient.emit('npmStop');
    setTimeout(function() {
        console.log('Stopping http/https server.');
        process.exit(0);
    }, 1000);
});

setTimeout(function() {
    console.log('Stopping http/https server. Server not found.');
    process.exit(0);
}, 5000);
