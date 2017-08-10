/* file: controller.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('settings')

    .controller('ctrSettings', [
        '$scope', '$window', 'RestService', 'MyError',
        function ctrSettings($scope, $window, RestService, MyError) {

            $scope.settings = {};
            $scope.newSettings = {};

            $scope.init = init;
            $scope.deleteUser = deleteUser;
            $scope.cancelChanges = cancelChanges;
            $scope.saveChanges = saveChanges;

            settingsRefresh();

            ////////////////////////////////////////

            function settingsRefresh() {

                if ($scope.uid) {

                    RestService.getSettings($scope.uid)

                    .then(function(res) {
                        $scope.settings = res.data;
                        $scope.cancelChanges(); // reset newSettings = settings
                    })

                    .catch(function(res) { MyError.alert(res); });

                }

            } // function settingsRefresh()

            function init(logintype,uid) {
                $scope.logintype = logintype === 'undefined' ? '' : logintype;
                $scope.uid = uid === 'undefined' ? '' : uid;
                settingsRefresh();
            } // function init(...)

            function deleteUser() {

                // eslint-disable-next-line no-alert
                if (confirm('Do you really want to delete the user?')) {

                    RestService.deleteUser($scope.uid)

                    .then(function(res) {
                        $window.location.href = '/'; // return to home page
                    })

                    .catch(function(res) {
                        MyError.alert(res);
                    });

                }

            } // function deleteUser(...)

            function cancelChanges() {
                $scope.newSettings = {};
                $scope.newSettings.fullName = $scope.settings.fullName;
                $scope.newSettings.city     = $scope.settings.city;
                $scope.newSettings.state    = $scope.settings.state;
                $scope.newSettings.country  = $scope.settings.country;
            } // function cancelChanges(...)

            function saveChanges() {

                $scope.newSettings.fullName = String($scope.newSettings.fullName).trim();
                $scope.newSettings.city     = String($scope.newSettings.city).trim();
                $scope.newSettings.state    = String($scope.newSettings.state).trim();
                $scope.newSettings.country  = String($scope.newSettings.country).trim();

                RestService.postSettings($scope.uid, $scope.newSettings)

                .then(function(res) {
                    settingsRefresh();
                })

                .catch(function(res) {
                    MyError.alert(res);
                });

            } // function saveChanges(...)

        } // function ctrSettings(...)
    ]); // .controller('myApp4Controller', ...

}());
