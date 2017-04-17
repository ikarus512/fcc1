/* file: web-sockets-store.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App3 Web Sockets Store
 * AUTHOR: ikarus512
 * CREATED: 2017/04/14
 *
 * MODIFICATION HISTORY
 *  2017/04/14, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
'use strict';

var
  d3 = require('d3'),
  data = [],
  tickets = [],
  Store = {};

Store.add = function(value) {
  data.push(String(value));
};

Store.remove = function(value) {
  data.splice(data.indexOf(value));
};

Store.get = function() {
  var res = data.map( function(el) { return el; });
  return res;
};



Store.ticketGenerate = function(userinfo) {
  var ticket, TWO_POW_24 = 16*1024*1024;

  do {
    ticket = Math.floor(d3.randomUniform(TWO_POW_24)()).toString(16) +
      Math.floor(d3.randomUniform(TWO_POW_24)()).toString(16) +
      Math.floor(d3.randomUniform(TWO_POW_24)()).toString(16);
  } while(tickets.indexOf(ticket) >= 0);

  tickets.push({ticket: ticket, userinfo: userinfo});

  return ticket;
};

Store.ticketCheck = function(ticket) {
  return tickets.some( function(el) { return (el.ticket===ticket); });
};

Store.ticketRemove = function(ticket) {
  var
    i,
    found = tickets.some( function(el,idx) { i=idx; return (el.ticket===ticket); });

  if (found) {
    tickets.splice(i);
  }
};





module.exports = Store;
