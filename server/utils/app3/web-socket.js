/* file: web-socket.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App3 Web Socket Service
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *  2017/05/11, ikarus512. Web socket server formed as module.
 *
 */

/*jshint node: true*/
'use strict';

var
  wsStore = require('./web-socket-store.js'),
  APPCONST = require('./../../config/constants.js'),
  myErrorLog = require('./../../utils/my-error-log.js'),
  registeredClients = [],

  wsHandlers = {

    'app3-check-ticket': function(ws, data) {
        if (wsStore.ticketCheck(data.ticket)) { // If ticket ok
            // Save ticket
            ws.myTicket = data.ticket;
            // Save client
            registeredClients.push(ws);
        }
    },

    'app3-add-stock-name': function(ws, data) {
        if (ws.myTicket) { // If ticket ok
            wsStore.addStockName(data.stockName);
        }
    },

    'app3-remove-stock-name': function(ws, data) {
        if (ws.myTicket) { // If ticket ok
            wsStore.removeStockName(data.stockName);
        }
    },

    'onClose': function(ws) {
        var i = registeredClients.indexOf(ws);
        if (i >= 0) {
            // Remove ticket
            wsStore.ticketRemove(registeredClients[i].myTicket);
            registeredClients[i].myTicket = undefined;
            // Remove client
            registeredClients.splice(i,1);
        }
    },

};

setInterval(function() {
    try {
        var newData = wsStore.getNewData();
        // wss.clients.forEach( function(client) {
        registeredClients.forEach(function(client) {
            client.send(JSON.stringify({msgtype: 'app3-stocks-data', data: newData}));
        });
    } catch (err) {
        myErrorLog(null, err);
    }
}, 0.5 * 1000 * APPCONST.APP3_STOCK_PORTION_LENGTH);

module.exports = wsHandlers;
