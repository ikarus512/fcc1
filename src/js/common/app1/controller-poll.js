/* file: controller-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .controller('ControllerPoll', [
      '$scope', '$location', '$window', 'StoragePoll', 'MyError',
      '$routeParams', 'MyConst', 'User', 'backendParams',
      function ($scope, $location, $window, StoragePoll, MyError,
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
            legend: {display: true, position: 'bottom',},
        };

        reloadPoll();

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
        }

        $scope.pollDelete = function() {
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
        };

        $scope.newOptionMode = function() {
            $scope.view = 'newOption';
        };

        $scope.newOptionCancel = function() {
            $scope.newOptionTitle = '';
            $scope.view = 'poll';
        };

        $scope.newOptionCreate = function() {
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
        };

        $scope.optionVote = function(option) {
            $scope.ajaxLoadingSpinner++;
            StoragePoll.put($scope.poll._id, option._id)
            .then(function(res) {
                reloadPoll();
            })
            .catch(function(err) { MyError.alert(err); })
            .finally(function() {$scope.ajaxLoadingSpinner--;});
        };

    }
    ]);

})();
