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

console.log('Waiting until http/https server starts.');

socketClient.on('connect', function() {
    socketClient.emit('npmServerRequest','Client asks if server ready.');
});

// Wait for server response.
socketClient.on('new message', function(data) {
    // console.log('Answer from server: ',data);
    console.log('Waiting stopped because server is ready.');
    process.exit(0);
});

// Stop waiting if server does not respond for too long.
setTimeout(function() {
    console.log('Waiting stopped because server did not respond for too long.');
    process.exit(0);
}, 30000);
