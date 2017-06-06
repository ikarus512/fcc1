/* file: service-myConst.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .service('MyConst', function() {

    this.serverUrl = '';
    this.webApp = true;
    this.mobileApp = !this.webApp;

  }); // .service('MyConst', ...

})();
