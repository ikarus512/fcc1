/* file: controller-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Controllers
 * @desc app1poll controllers
 * @memberOf clients.Modules.app1poll
 */
(function() {
    'use strict';

    angular
    .module('app1poll')
    .controller('ControllerPoll', ControllerPoll);

    /**
     * @classdesc App1 poll controller
     * @class
     * @param {Object} $scope
     * @param {Object} $location
     * @param {Object} $window
     * @param {Object} StoragePoll
     * @param {Object} MyError
     * @param {Object} $routeParams
     * @param {Object} MyConst
     * @param {Object} User
     * @param {Object} backendParams
     * @memberOf clients.Modules.app1poll.Controllers
     */
    function ControllerPoll(
        $scope, $location, $window, StoragePoll, MyError,
        $routeParams, MyConst, User, backendParams
    )
    {

        // Init params from backend
        if (MyConst.webApp) {
            $scope.logintype =
                (backendParams.logintype && backendParams.logintype !== 'undefined') ?
                backendParams.logintype : '';
            $scope.username =
                (backendParams.username && backendParams.username !== 'undefined') ?
                backendParams.username : '';
            $scope.pollId =
                (backendParams.pollId && backendParams.pollId !== 'undefined') ?
                backendParams.pollId : '';
        } else {
            User.check()
            .then(function() {
                $scope.logintype = User.type;
                $scope.username  = User.name;
            });
            $scope.pollId = $routeParams.pollId; // #!app1/polls/:pollId
        }

        $scope.urlPrefix = MyConst.urlPrefix;

        $scope.view = 'poll'; // poll/newOption
        $scope.newOptionTitle = '';

        $scope.ajaxLoadingSpinner = 0;

        $scope.poll = null;
        $scope.chartLabels = [];
        $scope.chartData = [];
        $scope.chartOptions = {
            title: {display: true, text: undefined},
            legend: {display: true, position: 'bottom'}
        };

        $scope.pollDelete = pollDelete;
        $scope.optionVote = optionVote;
        $scope.newOptionCreate = newOptionCreate;
        $scope.newOptionMode = newOptionMode;
        $scope.newOptionCancel = newOptionCancel;

        reloadPoll();

        ////////////////////////////////////////

        /**
         * Reload poll data from server (discard temporary local changes)
         * @static
         * @memberOf clients.Modules.app1poll.Controllers.ControllerPoll
         */
        function reloadPoll() {
            $scope.ajaxLoadingSpinner++;
            StoragePoll.get($scope.pollId)
            .then(function(res) {
                $scope.poll = res.data;

                $scope.chartOptions.title.text = $scope.poll.title;

                $scope.chartLabels = [];
                $scope.chartData = [];

                $scope.poll.options.forEach(function(option) {
                    $scope.chartLabels.push(option.title);
                    $scope.chartData.push(option.votes.length);
                });

            })
            .catch(function(err) { MyError.alert(err); })
            .finally(function() {$scope.ajaxLoadingSpinner--;});
        } // function reloadPoll(...)

        /**
         * Delete poll
         * @static
         * @memberOf clients.Modules.app1poll.Controllers.ControllerPoll
         */
        function pollDelete() {
            // eslint-disable-next-line no-alert
            if (confirm('Do you really want to delete the poll?')) {
                $scope.ajaxLoadingSpinner++;
                StoragePoll.delete($scope.poll._id)
                .then(function(res) { // Poll successfully deleted on server
                    // return to polls page
                    $window.location.href = MyConst.urlPrefix + '/app1/polls';
                })
                .catch(function(err) { MyError.alert(err); })
                .finally(function() {$scope.ajaxLoadingSpinner--;});
            }
        } // function pollDelete(...)

        /**
         * Switch to 'creating new option' mode
         * @static
         * @memberOf clients.Modules.app1poll.Controllers.ControllerPoll
         */
        function newOptionMode() {
            $scope.view = 'newOption';
        } // function newOptionMode(...)

        /**
         * Cancel 'creating new option' mode
         * @static
         * @memberOf clients.Modules.app1poll.Controllers.ControllerPoll
         */
        function newOptionCancel() {
            $scope.newOptionTitle = '';
            $scope.view = 'poll';
        } // function newOptionCancel(...)

        /**
         * Create new option
         * @static
         * @memberOf clients.Modules.app1poll.Controllers.ControllerPoll
         */
        function newOptionCreate() {
            var title = $scope.newOptionTitle.trim();

            if (title) {
                $scope.ajaxLoadingSpinner++;
                StoragePoll.post($scope.poll._id, title)
                .then(function(res) {
                    reloadPoll();

                    $scope.newOptionTitle = '';
                    $scope.view = 'poll';
                })
                .catch(function(err) { MyError.alert(err); })
                .finally(function() {$scope.ajaxLoadingSpinner--;});

            }
        } // function newOptionCreate(...)

        /**
         * Vote for option
         * @static
         * @param {Object} option Option to vote for
         * @memberOf clients.Modules.app1poll.Controllers.ControllerPoll
         */
        function optionVote(option) {
            $scope.ajaxLoadingSpinner++;
            StoragePoll.put($scope.poll._id, option._id)
            .then(function(res) {
                reloadPoll();
            })
            .catch(function(err) { MyError.alert(err); })
            .finally(function() {$scope.ajaxLoadingSpinner--;});
        } // function optionVote(...)

    } // function ControllerPoll(...)

    ControllerPoll.$inject = [
        '$scope', '$location', '$window', 'StoragePoll', 'MyError',
        '$routeParams', 'MyConst', 'User', 'backendParams'
    ];

}());
