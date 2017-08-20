/* file: service-user.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('a_common')

    .service('User', function User() {

        this.type = '';
        this.name = '';
        this.uid = '';
        this.loginLocal = function(username, password) {};

    }); // .service('User', ...

}());
