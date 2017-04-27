/* file: app1-controller-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerPoll', [
    '$scope', '$location', '$window', 'StoragePoll', 'MyError',
    function ($scope, $location, $window, StoragePoll, MyError) {

      $scope.view = 'poll'; // poll/newOption
      $scope.newOptionTitle = '';

      $scope.poll = null;
      $scope.poll_id = undefined;
      $scope.chartLabels = [];
      $scope.chartData = [];
      $scope.chartOptions = {
        title: { display: true, text: undefined },
        legend: { display: true, position: 'bottom', },
      };

      function reloadPoll() {
        StoragePoll.get($scope.poll_id)
        .then( function(res) {
          $scope.poll = res.data;

          $scope.chartOptions.title.text = $scope.poll.title;

          $scope.chartLabels = [];
          $scope.chartData = [];

          $scope.poll.options.forEach( function(option) {
            $scope.chartLabels.push(option.title);
            $scope.chartData.push(option.votes.length);
          });

        });
      }

      $scope.init = function(logintype, poll_id) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
        $scope.poll_id = poll_id;
        reloadPoll();
      };

      $scope.pollDelete = function() {
        if (confirm('Do you really want to delete the poll?')) {
          StoragePoll.delete($scope.poll._id)
          .then( function onOk(res) { // Poll successfully deleted on server
            $window.location.href = '/app1/polls'; // return to polls page
          }, function onErr(res) {
            // Report error during poll deletion
            MyError.alert(res);
          });
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
        var title=$scope.newOptionTitle.trim();

        if (title) {
          StoragePoll.post($scope.poll._id, title)
          .then( function onOk(res) {
            reloadPoll();

            $scope.newOptionTitle = '';
            $scope.view = 'poll';
          }, function onErr(res) {
            // Report error during poll creation
            MyError.alert(res);
          });

        }
      };

      $scope.optionVote = function(option) {
        StoragePoll.put($scope.poll._id, option._id)
        .then( function onOk(res) {
          reloadPoll();
        }, function onErr(res) {
          // Report error during poll creation
          MyError.alert(res);
        });
      };

  }]);

})();
