/* file: service-user.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .service('User', [
    'LoginFactory',
    function(LoginFactory) {

      var self = this;

      this.type = '';
      this.name = '';
      this.uid = '';
      this.loginLocal = function(username, password) {
        return LoginFactory.loginLocal(username, password)
        .then( function(res) {
          self.type = res.data.type;
          self.name = res.data.name;
          self.uid = res.data.uid;
          console.log('logged in as: ', res.data);
          return res;
        });
      };

    }

  ]); // .service('User', ...

})();
