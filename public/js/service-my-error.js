/* file: service-my-error.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('MyError',

    function () {

      return {

        alert: function(res) {
          if (res && res.data && res.data.message) {
            alert(res.data.message);
            console.log(res.data.message);
          } else {
            console.log(res);
          }
        }, // alert: function(...)

        log: function(res) {
          if (res && res.data && res.data.message) {
            console.log(res.data.message);
          } else {
            console.log(res);
          }
        }, // log: function(...)

      };

    }

  ); // .factory('MyError', ...

})();
