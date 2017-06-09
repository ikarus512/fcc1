/* file: controller-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('ControllerPolls', [
    '$scope', 'StoragePolls', 'MyError', 'MyConst', 'User',
    'init_logintype',
    function ($scope, StoragePolls, MyError, MyConst, User,
      init_logintype
    )
    {

      // Init params from backend
      if (MyConst.webApp) {
        $scope.logintype = init_logintype==='undefined' ? '' : init_logintype;
      } else {
        $scope.logintype = User.getType();
        console.log('logged in as: ', User.getType(), User.getName(), User.getUid());
      }
      $scope.urlPrefix = MyConst.urlPrefix;

      $scope.view = 'polls'; // polls/newPoll
      $scope.newPollTitle = '';
      $scope.editedPoll = null;

      $scope.polls = [];
      StoragePolls.get().then( function(res) { $scope.polls=res.data; } );


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
            MyError.alert(res);
          });

        }
      };

    }
  ]); // .controller('ControllerPolls', ...

})();
