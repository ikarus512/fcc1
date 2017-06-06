/* file: service-myConst.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .service('MyConst', function() {

    // this.serverUrl = 'https://ikarus512-fcc1.herokuapp.com'; // production
    this.serverUrl = 'https://localhost:5000'; // developement
    this.webApp = false;
    this.mobileApp = !this.webApp;

  }); // .service('MyConst', ...

})();
