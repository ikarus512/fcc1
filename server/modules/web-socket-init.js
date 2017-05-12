/* file: web-socket-init.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Web Socket Server Initialization
 * AUTHOR: ikarus512
 * CREATED: 2017/05/11
 *
 * MODIFICATION HISTORY
 *  2017/05/11, ikarus512. Web socket server formed as module.
 *  2017/05/12, ikarus512. Added web socket interface for app4.
 *
 */

/*jshint node: true*/
'use strict';

var
  wss = require('./web-socket-server.js'),
  wsApp3 = require('./../utils/app3/web-socket.js'),
  wsApp4 = require('./../utils/app4/web-socket.js');


module.exports = function(options) {

  if (options && options.server) wss.init(options.server);

  wss.registerHandlers(wsApp3);
  wss.registerHandlers(wsApp4);

};
