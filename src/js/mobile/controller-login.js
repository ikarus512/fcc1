/* file: controller-login.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .controller('ControllerLoginMobile', [
        '$scope', '$location', 'MyError', 'User', 'MyConst',
        function ControllerLoginMobile($scope, $location, MyError, User, MyConst) {

            User.check()
            .then(function() {
                $scope.logintype = User.type;
                $scope.username  = User.name;
                $scope.uid       = User.uid;
                console.log('check login: ', User.type, User.name, User.uid);
            });

            $scope.login = login;

            ////////////////////////////////////////

            function login() {
                User.loginLocal($scope.usernameNew, $scope.passwordNew)
                .then(function(res) {
                    $scope.logintype = User.type;
                    $scope.username  = User.name;
                    $scope.uid       = User.uid;
                    console.log('logged in as: ', User.type, User.name, User.uid);
                    if ($scope.logintype) {
                        $location.path('/'); // Go to home page
                    }
                })
                .catch(function(err) { MyError.alert(err); });
            } // function login(...)

        } // function ControllerLoginMobile(...)
    ]); // .controller('ControllerLoginMobile', ...

}());
