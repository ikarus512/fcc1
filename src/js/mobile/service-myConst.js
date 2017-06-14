/* file: service-myConst.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  // Parameters from web backend (not used in mobile app)
  .value('init_logintype', 'undefined')
  .value('init_username' , 'undefined')
  .value('init_uid'      , 'undefined')

  .service('MyConst', function() {

    // var host = 'ikarus512-fcc1.herokuapp.com'; // production
    var host = 'localhost:5000'; // developement

    this.urlPref = '';
    this.urlPrefix = '#!';
    this.serverUrl = 'https://' + host;
    this.webSocketHost = 'wss://' + host;
    this.webApp = false;
    this.mobileApp = !this.webApp;

  }); // .service('MyConst', ...

})();
