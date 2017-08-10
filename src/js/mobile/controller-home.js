/* file: controller-home.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .controller('ControllerHomeMobile', [
        '$scope', '$location', 'User', 'MyConst',
        function ControllerHomeMobile($scope, $location, User, MyConst) {

            $scope.ajaxLoadingSpinner = 0;

            User.check()
            .then(function() {
                $scope.logintype = User.type;
                $scope.username  = User.name;
                $scope.uid       = User.uid;
            });

        } // function ControllerHomeMobile(...)

    ]); // .controller('ControllerHomeMobile', ...

}());
