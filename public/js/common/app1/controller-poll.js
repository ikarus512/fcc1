/* file: controller-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerPoll', [
    '$scope', '$location', '$window', 'StoragePoll', 'MyError',
    '$routeParams', 'MyConst', 'User',
    function ($scope, $location, $window, StoragePoll, MyError,
      $routeParams, MyConst, User
    )
    {

      $scope.urlPrefix = MyConst.urlPrefix;

      $scope.view = 'poll'; // poll/newOption
      $scope.newOptionTitle = '';

      $scope.ajaxLoadingSpinner = 0;

      $scope.poll = null;
      $scope.poll_id = undefined;
      $scope.chartLabels = [];
      $scope.chartData = [];
      $scope.chartOptions = {
        title: { display: true, text: undefined },
        legend: { display: true, position: 'bottom', },
      };

      function reloadPoll() {
        $scope.ajaxLoadingSpinner++;
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

        })
        .catch( function(err) { MyError.alert(err); } )
        .finally( function() {$scope.ajaxLoadingSpinner--;});
      }

      $scope.init = function(logintype, poll_id) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
        $scope.poll_id = poll_id;

        if (MyConst.mobileApp) {
          $scope.logintype = User.type;
          console.log('logged in as: ', User.type, User.name, User.uid);

          $scope.poll_id = $routeParams.pollId; // #!app1/polls/:pollId
          console.log('poll id: ' + $scope.poll_id);
        }

        reloadPoll();
      };

      $scope.pollDelete = function() {
        if (confirm('Do you really want to delete the poll?')) {
          $scope.ajaxLoadingSpinner++;
          StoragePoll.delete($scope.poll._id)
          .then( function(res) { // Poll successfully deleted on server
            // return to polls page
            $window.location.href = MyConst.urlPrefix + '/app1/polls';
          })
          .catch( function(err) { MyError.alert(err); } )
          .finally( function() {$scope.ajaxLoadingSpinner--;});
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
          $scope.ajaxLoadingSpinner++;
          StoragePoll.post($scope.poll._id, title)
          .then( function(res) {
            reloadPoll();

            $scope.newOptionTitle = '';
            $scope.view = 'poll';
          })
          .catch( function(err) { MyError.alert(err); } )
          .finally( function() {$scope.ajaxLoadingSpinner--;});

        }
      };

      $scope.optionVote = function(option) {
        $scope.ajaxLoadingSpinner++;
        StoragePoll.put($scope.poll._id, option._id)
        .then( function(res) {
          reloadPoll();
        })
        .catch( function(err) { MyError.alert(err); } )
        .finally( function() {$scope.ajaxLoadingSpinner--;});
      };

    }
  ]);

})();
