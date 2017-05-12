/* file: web-socket-store.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App4 Web Socket Store
 * AUTHOR: ikarus512
 * CREATED: 2017/05/12
 *
 * MODIFICATION HISTORY
 *
 */

/*jshint node: true*/
'use strict';

var
  Book = require('../../models/app4-books.js'),
  myErrorLog = require('../../utils/my-error-log.js'),
  d3 = require('d3'),
  wsStore = {},
  tickets = [];




wsStore.ticketGenerate = function(userinfo) {
  var ticket, TWO_POW_24 = 16*1024*1024;

  do {
    ticket = Math.floor(d3.randomUniform(TWO_POW_24)()).toString(16) +
      Math.floor(d3.randomUniform(TWO_POW_24)()).toString(16) +
      Math.floor(d3.randomUniform(TWO_POW_24)()).toString(16);
  } while(tickets.indexOf(ticket) >= 0);

  tickets.push({ticket: ticket, userinfo: userinfo});

  return ticket;
};

wsStore.ticketCheck = function(ticket) {
  return tickets.some( function(el) { return (el.ticket===ticket); });
};

wsStore.ticketRemove = function(ticket) {
  var
    i,
    found = tickets.some( function(el,idx) { i=idx; return (el.ticket===ticket); });

  if (found) {
    tickets.splice(i,1);
  }
};




wsStore.wsClients = {};


wsStore.sendMessage = function(bookId, from, to, time, text) {

  // Add message to book.bid
  Book.addMsg(bookId, from, to, time, text)

  // Find recipient socket, if present, and send him message
  .then( function() {

    var wsClients = wsStore.wsClients;

    if (wsClients[bookId]) {
      for (var ticket in wsClients[bookId]) {
        if (wsClients[bookId][ticket].uid === to) {
          wsClients[bookId][ticket].send(JSON.stringify({
            msgtype: 'app4-message',
            // bookId: bookId,
            from: from,
            to: to,
            time: time,
            text: text,
          }));
        }
      }
    }

  })

  // Internal error
  .catch( function(err) {
    var message = 'Internal error e000000b.';
    myErrorLog(null, err, message);
  });

};


module.exports = wsStore;
