/* file: config-routes.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

angular.module('myapp')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: "views/main.html"
  })
  .when("/app1/polls", {
    templateUrl: "views/app1_polls.html",
    controller: 'ControllerPolls',
  })
  .when("/app1/polls/:pollId", {
    templateUrl: "views/app1_poll.html",
    controller: 'ControllerPoll',
  })
  .when("/green", {
    templateUrl: "views/green.html",
  })
  .when("/blue", {
    templateUrl: "views/blue.html",
  })
  .otherwise({
    redirectTo: '/'
  });
}]);