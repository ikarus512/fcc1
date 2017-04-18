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
  APPCONST = require('./../../config/constants.js'),
  myErrorLog = require('./../../utils/my-error-log.js'),
  registeredClients = [];

module.exports = function(server) {

  var
    SocketServer = require('ws').Server,
    wss = new SocketServer({server:server});

  wss.on('error', function (err) {
    myErrorLog(null, err);
  });

  wss.on('connection', function(ws) {

    ws.on('message', function(msg) {
      try {
        var data = JSON.parse(msg);
        if (data.msgtype === 'check-ticket') {
          if(wsStore.ticketCheck(data.ticket)) { // If ticket ok
            // Save ticket
            ws.myTicket = data.ticket;
            // Save client
            registeredClients.push(ws);
          }
        } else if (ws.myTicket && data.msgtype === 'add-stock-name') {
          wsStore.addStockName(data.stockName);
        } else if (ws.myTicket && data.msgtype === 'remove-stock-name') {
          wsStore.removeStockName(data.stockName);
        }
      } catch(err) {
        myErrorLog(null, err);
      }
    });

    ws.on('close', function() {
      var i=registeredClients.indexOf(ws);
      if (i>=0) {
        // Remove ticket
        wsStore.ticketRemove(registeredClients[i].myTicket);
        registeredClients[i].myTicket = undefined;
        // Remove client
        registeredClients.splice(i,1);
      }
    });
  });



  setInterval( function() {
    try {
      var newData = wsStore.getNewData();
      wss.clients.forEach( function(client) {
      // registeredClients.forEach( function(client) {
        client.send(JSON.stringify({msgtype: 'stocks-data', data: newData}));
      });
    } catch(err) {
      myErrorLog(null, err);
    }
  }, 0.5*1000 * APPCONST.APP3_STOCK_PORTION_LENGTH);

};
