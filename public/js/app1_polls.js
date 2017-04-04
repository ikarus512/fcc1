/* file: app1_polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;(function(){
  'use strict';

  var app=angular.module("myApp1Voting", []);

  app.controller('myApp1Controller',
    ['$scope', '$location', 'pollStorage',
    function ($scope, $location, pollStorage) {

      $scope.view = 'polls'; // polls/newPoll
      $scope.newPollTitle = '';
      $scope.editedPoll = null;

      $scope.polls = [];
      pollStorage.get().then(function(res){ $scope.polls=res.data; });

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
          pollStorage.post({title: title})
          .then(function onOk(res){
            var poll = res.data;

            $scope.polls.push(poll);

            $scope.newPollTitle = '';
            $scope.view = 'polls';
          },function onErr(res){
            // Report error during poll creation
            alert(res.data.message);
          });

        }
      };

  }]);

  app.directive('myEscape', function () {

    var ESCAPE_KEY = 27;

    return function (scope, elem, attrs) {
      elem.bind('keyup', function (event) {
        if (event.keyCode === ESCAPE_KEY) {
          scope.$apply(attrs.myEscape);
        }
      });

      scope.$on('$destroy', function () {
        elem.unbind('keyup');
      });
    };

  });

  app.directive('myEnter', function () {

    var ENTER_KEY = 13;

    return function (scope, elem, attrs) {
      elem.bind('keyup', function (event) {
        if (event.keyCode === ENTER_KEY) {
          scope.$apply(attrs.myEnter);
        }
      });

      scope.$on('$destroy', function () {
        elem.unbind('keyup');
      });
    };

  });

  app.directive('myFocus', ['$timeout',function($timeout) {

    return function (scope, elem, attrs) {
      scope.$watch(attrs.myFocus, function (newVal) {
        if (newVal) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  }]);

  app.factory('pollStorage', ['$http', function ($http) {
    return {
      get: function () {
        return $http({
          method: 'GET',
          data:{},
          url: '/app1/api/polls'
        });
      },

      post: function (poll) {
        return $http({
          method: 'POST',
          data:poll,
          url: '/app1/api/polls'
        });
      },

    };

  }]);

})();
