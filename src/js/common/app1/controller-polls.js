/* file: controller-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .controller('ControllerPolls', [
        '$scope', 'StoragePolls', 'MyError', 'MyConst', 'User',
        'backendParams',
        function ControllerPolls($scope, StoragePolls, MyError, MyConst, User,
            backendParams
        )
        {

            $scope.ajaxLoadingSpinner = 0;

            // Init params from backend
            if (MyConst.webApp) {
                $scope.logintype =
                    (backendParams.logintype && backendParams.logintype !== 'undefined') ?
                    backendParams.logintype : '';
                $scope.username =
                    (backendParams.username && backendParams.username !== 'undefined') ?
                    backendParams.username : '';
            } else {
                $scope.ajaxLoadingSpinner++;
                User.check()
                .then(function() {
                    $scope.logintype = User.type;
                    $scope.username  = User.name;
                })
                .finally(function() {$scope.ajaxLoadingSpinner--;});
            }
            $scope.urlPrefix = MyConst.urlPrefix;

            $scope.view = 'polls'; // polls/newPoll
            $scope.newPollTitle = '';
            $scope.editedPoll = null;

            $scope.newPollMode = newPollMode;
            $scope.newPollCancel = newPollCancel;
            $scope.newPollCreate = newPollCreate;

            $scope.polls = [];
            $scope.ajaxLoadingSpinner++;
            StoragePolls.get()
            .then(function(res) { $scope.polls = res.data; })
            .catch(function(err) { MyError.alert(err); })
            .finally(function() {$scope.ajaxLoadingSpinner--;});

            ////////////////////////////////////////

            function newPollMode() {
                $scope.view = 'newPoll';
            } // function newPollMode(...)

            function newPollCancel() {
                $scope.newPollTitle = ''; $scope.view = 'polls';
            } // function newPollCancel(...)

            function newPollCreate() {
                var title = $scope.newPollTitle.trim();

                if (title) {
                    $scope.ajaxLoadingSpinner++;
                    StoragePolls.post({title: title})
                    .then(function onOk(res) {
                        var poll = res.data;

                        $scope.polls.push(poll);

                        $scope.newPollTitle = '';
                        $scope.view = 'polls';
                    })
                    .catch(function(err) { MyError.alert(err); })
                    .finally(function() {$scope.ajaxLoadingSpinner--;});

                }
            } // function newPollCreate(...)

        } // function ControllerPolls(...)

    ]); // .controller('ControllerPolls', ...

}());
