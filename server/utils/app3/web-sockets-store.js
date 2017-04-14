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
  data = [],
  Store = {};

Store.add = function(value) {
  data.push(new String(value));
};

Store.remove = function(value) {
  data.splice(data.indexOf(value));
};

Store.get = function() {
  var res = data.map( function(el) { return el; });
  return res;
};


module.exports = Store;
