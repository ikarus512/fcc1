/* file: controller-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Controllers
 * @desc app1poll controllers
 * @memberOf clients.Modules.app1polls
 */
(function() {
    'use strict';

    angular
    .module('app1polls')
    .controller('ControllerPolls', ControllerPolls);

    /**
     * @classdesc App1 polls controller
     * @class
     * @param {Object} $scope
     * @param {Object} StoragePolls
     * @param {Object} MyError
     * @param {Object} MyConst
     * @param {Object} User
     * @param {Object} backendParams
     * @memberOf clients.Modules.app1polls.Controllers
     */
    function ControllerPolls(
        $scope, StoragePolls, MyError, MyConst, User, backendParams
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

        /**
         * Switch to 'creating new poll' mode
         * @static
         * @memberOf clients.Modules.app1polls.Controllers.ControllerPolls
         */
        function newPollMode() {
            $scope.view = 'newPoll';
        } // function newPollMode(...)

        /**
         * Cancel 'creating new poll' mode
         * @static
         * @memberOf clients.Modules.app1polls.Controllers.ControllerPolls
         */
        function newPollCancel() {
            $scope.newPollTitle = ''; $scope.view = 'polls';
        } // function newPollCancel(...)

        /**
         * Create new poll
         * @static
         * @memberOf clients.Modules.app1polls.Controllers.ControllerPolls
         */
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

    ControllerPolls.$inject = [
        '$scope', 'StoragePolls', 'MyError', 'MyConst', 'User', 'backendParams'
    ];

}());
