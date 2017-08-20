/* file: controller-common.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('a_common')

    .controller('mobileCommonCtrl', [
        '$scope', '$location', 'User', 'MyConst',
        function mobileCommonCtrl($scope, $location, User, MyConst) {

            $scope.appExit = appExit;

            ////////////////////////////////////////

            function appExit() {
                if (confirm('Exit?')) { navigator.app.exitApp(); }
            } // function appExit(...)

        } // function mobileCommonCtrl(...)

    ]); // .controller('mobileCommonCtrl', ...

}());
