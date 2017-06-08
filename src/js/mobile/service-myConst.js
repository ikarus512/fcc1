/* file: service-myConst.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .service('MyConst', function() {

    var host = 'ikarus512-fcc1.herokuapp.com'; // production
    // var host = 'localhost:5000'; // developement

    this.urlPrefix = '#!';
    this.serverUrl = 'https://' + host;
    this.webSocketHost = 'wss://' + host;
    this.webApp = false;
    this.mobileApp = !this.webApp;

  }); // .service('MyConst', ...

})();
