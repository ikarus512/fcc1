/* file: app3.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  var app = angular.module('myApp3', []);

  app.controller('myApp3ControllerMain',
    ['$scope', 'pollStorage', 'WebSocketService',
    function ($scope, pollStorage, WebSocketService) {

      $scope.time = '--';

      WebSocketService.subscribe( function(time) {
        $scope.time = time;
        $scope.$apply();
      });

  }]); // app.controller('myApp3ControllerMain', ...


  app.factory('WebSocketService', ['$rootScope', function($rootScope) {

    var Service = {};

    var HOST = (window.document.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.document.location.host;
    var ws = new WebSocket(HOST);

    ws.onmessage = function(message) {
      if (Service.callback) Service.callback(message.data);
    };

    Service.time = '-';

    Service.subscribe = function(callback) {
      Service.callback = callback;
    };

    return Service;

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

  }]); // app.factory('pollStorage', ...

})();
