/* file: app1-controller-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerPolls',
    ['$scope', 'StoragePolls',
    function ($scope, StoragePolls) {

      $scope.view = 'polls'; // polls/newPoll
      $scope.newPollTitle = '';
      $scope.editedPoll = null;

      $scope.polls = [];
      StoragePolls.get().then( function(res) { $scope.polls=res.data; } );

      $scope.init = function(logintype) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
      };

      $scope.newPollMode = function() {
        $scope.view = 'newPoll';
      };

      $scope.newPollCancel = function() {
        $scope.newPollTitle = ''; $scope.view = 'polls';
      };

      $scope.newPollCreate = function() {
        var title=$scope.newPollTitle.trim();

        if (title) {
          StoragePolls.post({title: title})
          .then( function onOk(res) {
            var poll = res.data;

            $scope.polls.push(poll);

            $scope.newPollTitle = '';
            $scope.view = 'polls';
          }, function onErr(res) {
            // Report error during poll creation
            alert(res.data.message);
          });

        }
      };

  }]); // app.controller('ControllerPolls', ...

})();
