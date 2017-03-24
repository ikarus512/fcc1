'use strict';

var app=angular.module("myApp1Poll", []);

app.controller('myApp1PollController',
  ['$scope', '$location', '$window', 'pollOptStorage',
  function ($scope, $location, $window, pollOptStorage) {

    $scope.view = 'poll'; // poll/newOption
    $scope.newOptionTitle = '';

    $scope.poll = null;

    $scope.init = function(logintype, poll_id) {
      $scope.logintype = logintype==='undefined' ? '' : logintype;
      pollOptStorage.get(poll_id).then(function(res){ $scope.poll=res.data; });
    };

    $scope.pollDelete = function() {
      if (confirm("Do you really want to delete the poll?")) {
        pollOptStorage.delete($scope.poll._id)
        .then(function onOk(res){ // Poll successfully deleted on server
          $window.location.reload(true); // reload page (true==not from cache)
          // $window.location.href = '/app1/polls'; // go to page (like refresh)
          // $window.history.back(); // unused because does not refresh page
        },function onErr(res){
          // Report error during poll deletion
          alert(res.data.message);
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
        pollOptStorage.post($scope.poll._id, title)
        .then(function onOk(res){
          //$scope.poll = res.data;
          pollOptStorage.get($scope.poll._id).then(function(res){ $scope.poll=res.data; });

          $scope.newOptionTitle = '';
          $scope.view = 'poll';
        },function onErr(res){
          // Report error during poll creation
          alert(res.data.message);
        });

      }
    };

    $scope.optionVote = function(option) {
      pollOptStorage.put($scope.poll._id, option._id)
      .then(function onOk(res){
        pollOptStorage.get($scope.poll._id).then(function(res){ $scope.poll=res.data; });
      },function onErr(res){
        // Report error during poll creation
        alert(res.data.message);
      });
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

app.factory('pollOptStorage', ['$http', function ($http) {
  return {
    get: function (poll_id) {
      return $http({
        method: 'GET',
        data: {},
        url: '/app1/api/polls/'+poll_id
      });
    },

    post: function (poll_id,title) { // create new option
      return $http({
        method: 'POST',
        data: {title: title},
        url: '/app1/api/polls/'+poll_id+'/options'
      });
    },

    put: function (poll_id, opt_id) { // vote for poll option
      return $http({
        method: 'PUT',
        data: {},
        url: '/app1/api/polls/'+poll_id+'/options/'+opt_id+'/vote'
      });
    },

  };

}]);
