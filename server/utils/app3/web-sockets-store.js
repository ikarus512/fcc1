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
  APPCONST = require('./../../config/constants.js'),
  wsStore = {},
  tickets = [],
  gauss = d3.randomNormal(1.0,0.01),
  allStocks = {
    'stock1': Array(APPCONST.APP3_STOCK_PORTION_LENGTH).fill(49.0),
    'stock2': Array(APPCONST.APP3_STOCK_PORTION_LENGTH).fill(50.0),
    'stock3': Array(APPCONST.APP3_STOCK_PORTION_LENGTH).fill(51.0),
    'stock4': Array(APPCONST.APP3_STOCK_PORTION_LENGTH).fill(52.0),
    'stock5': Array(APPCONST.APP3_STOCK_PORTION_LENGTH).fill(53.0),
  },
  allStockIds = Object.keys(allStocks),
  selStockIds = [allStockIds[0], allStockIds[1], allStockIds[2]];





wsStore.getNewData = function() {
  var i, key, d = new Date(), data={};

  // Generate time data
  data.x = [];
  for (i=0; i<APPCONST.APP3_STOCK_PORTION_LENGTH; i++) {
    data.x.push( new Date(d.getTime()+i*0.5*1000).toISOString() );
  }

  // Generate new stock data
  for ( key in allStocks ) {
    var v1 = allStocks[key][APPCONST.APP3_STOCK_PORTION_LENGTH-1];
    for (i=0; i<APPCONST.APP3_STOCK_PORTION_LENGTH; i++) {
      v1 *= gauss();
      if (v1<1 || v1>1000) v1 = 50.0;
      allStocks[key][i] = v1;
    }
  }

  // Return only selected data
  data.stocks = {};
  selStockIds.forEach( function(key) {
    data.stocks[key] = {};
    data.stocks[key].id = key;
    data.stocks[key].values = allStocks[key].map( function(el,idx) {
      return {
        x: data.x[idx],
        y: el,
      };
    });
  });

  return {
    title: 'Title',
    note: 'Description',
    data: data,
  };
};



wsStore.addStockName = function(name) {
  if (
    allStockIds.indexOf(name)>=0 && // allowed name
    selStockIds.indexOf(name)<0     // not yet added
  )
  {
    selStockIds.push(String(name)); // add to selection
    return true;
  } else {
    return false;
  }
};

wsStore.removeStockName = function(name) {
  if (
    allStockIds.indexOf(name)>=0 && // allowed name
    selStockIds.indexOf(name)>=0 && // was selected
    selStockIds.length>1            // keep selection size >= 1
  )
  {
    selStockIds.splice(selStockIds.indexOf(name),1); // remove from selection
    return true;
  } else {
    return false;
  }
};




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





module.exports = wsStore;
