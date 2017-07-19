/* file: web-socket.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App4 Web Socket Service
 * AUTHOR: ikarus512
 * CREATED: 2017/05/12
 *
 * MODIFICATION HISTORY
 *
 */

/*jshint node: true*/
'use strict';

var
  APPCONST = require('./../../config/constants.js'),
  myErrorLog = require('./../../utils/my-error-log.js'),

  wsStore = require('./web-socket-store.js'),
  wsClients = wsStore.wsClients,

  wsHandlers = {

    'app4-check-ticket': function(ws, data) {
        if (wsStore.ticketCheck(data.ticket)) { // If ticket ok
            if (data.bookId) {
                // Save ticket/bookId
                ws.ticket = data.ticket;
                ws.bookId = data.bookId;
                ws.uid = data.uid;
                // Save client
                wsClients[ws.bookId] = wsClients[ws.bookId] || {};
                wsClients[ws.bookId][ws.ticket] = ws;
            }
        }
    },

    'app4-message': function(ws, data) {
        if (ws.ticket) { // If ticket ok
            wsStore.sendMessage(
              data.bookId,
              data.from,
              data.to,
              data.time,
              data.text
            );
        }
    },

    'onClose': function(ws) {
        var bookId = ws.bookId,
          ticket = ws.ticket;
        if (bookId && wsClients[bookId] && wsClients[bookId][ticket]) {
            // Remove ticket/bookId
            wsStore.ticketRemove(ws.ticket);
            ws.ticket = undefined;
            ws.bookId = undefined;
            // Remove client
            delete wsClients[bookId][ticket];
            if (Object.keys(wsClients[bookId]).length === 0) {
                delete wsClients[bookId];
            }
        }
    },

};

module.exports = wsHandlers;
