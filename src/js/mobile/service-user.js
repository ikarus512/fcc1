/* file: service-user.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .service('User', [
        'LoginFactory', 'MyConst', '$http',
        function User(LoginFactory, MyConst, $http) {

            var self = this;

            self.check = check;
            self.loginLocal = loginLocal;

            ////////////////////////////////////////

            function check() { // Check if user logged in
                return LoginFactory.check()
                .then(function(res) {
                    self.type = res.data.type;
                    self.name = res.data.name;
                    self.uid  = res.data.uid;
                    return;
                })
                .catch(function(err) { // eslint-disable-line handle-callback-err
                    self.type = undefined;
                    self.name = undefined;
                    self.uid  = undefined;
                    return;
                });
            } // function check(...)

            function loginLocal(username, password) {
                return LoginFactory.loginLocal(username, password)
                .then(function(res) {
                    self.type = res.data.type;
                    self.name = res.data.name;
                    self.uid = res.data.uid;
                    return;
                })
                .catch(function(err) {
                    self.type = undefined;
                    self.name = undefined;
                    self.uid = undefined;
                    throw err;
                });
            } // function loginLocal(...)

        }

    ]); // .service('User', ...

}());
