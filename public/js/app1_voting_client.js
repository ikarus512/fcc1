var app=angular.module("myApp1Voting", []);

app.controller('myApp1Controller',
  ['$scope', '$location',
  function ($scope, $location) {
      var polls = $scope.polls = [];

      $scope.init = function(logintype) {
        $scope.logintype = logintype;
      };

      $scope.newTodoText = '';
      $scope.editedTodo = null;
      $scope.originalTodo = null;

      $scope.$watch('polls', function () {
        $scope.remainingCount = polls.filter(function(v){return !v.done;}).length;
        $scope.doneCount = polls.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
      }, true);

      if ($location.path() === '') {
        $location.path('/');
      }

      $scope.location = $location;

      $scope.$watch('location.path()', function (path) {
        $scope.statusFilter =
          (path === '/active')    ? {done:false} :
          (path === '/completed') ? {done:true } :
                                    {};
      });



}]);
