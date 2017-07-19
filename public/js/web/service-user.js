/* file: service-user.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;(function() {
    'use strict';

    angular.module('myapp')

    .service('User', function() {

        this.type = '';
        this.name = '';
        this.uid = '';
        this.loginLocal = function(username, password) {};

    }); // .service('User', ...

})();
