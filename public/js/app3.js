/* file: app3.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  var app = angular.module('myApp3', []);

  app.controller('myApp3ControllerMain',
    ['$scope', 'RESTService', 'WebSocketService',
    function ($scope, RESTService, WebSocketService) {

      $scope.time = '--';

      WebSocketService.subscribe( function(data) {
        $scope.time = data.items.join(', ') + ' /// ' + data.time;
        $scope.$apply();
      });

  }]); // app.controller('myApp3ControllerMain', ...


  app.factory('WebSocketService', ['RESTService', function(RESTService) {

    var Service = {};

    var HOST = (window.document.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.document.location.host;
    var ws = new WebSocket(HOST);

    ws.onmessage = function(message) {
      var data = JSON.parse(message.data);
      if (Service.callback) Service.callback(data);
    };

    Service.subscribe = function(callback) {
      Service.callback = callback;
    };

    return Service;

  }]);




  app.factory('RESTService', ['$http', function ($http) {
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

  }]); // app.factory('RESTService', ...

})();
