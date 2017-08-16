/* file: socket-io-server.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Socket.io Server
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
    APPCONST = require('./../config/constants.js'),
    socketIo = require('socket.io');

module.exports = /*istanbul ignore next*/ function(server, shutdownFunction) {

    if (APPCONST.env.NODE_ENV !== 'production') {

        // Using socket.io during tests to:
        // 1) stop server in response to the npmStop signal,
        // 2) answer to client in response to npmServerRequest signal.
        var io = socketIo(server);
        io.on('connection', function(socketServer) { // Here if new client connected
            socketServer.on('npmStop', function() {
                console.log('Server received npmStop.');
                shutdownFunction(); // Stop server
                // process.exit(0); // Stop server
            });
            socketServer.on('npmServerRequest', function(data) {
                console.log('Server received request: ', data);
                socketServer.emit('new message', 'Server is ready.'); // Answer to client
            });
        });

    }

};
