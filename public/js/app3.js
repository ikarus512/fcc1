/* file: app3.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

$(document).ready( function() {
  var HOST = location.origin.replace(/^https/, 'wss');
  var ws = new WebSocket(HOST);
  var el = document.getElementById('timer1');
  ws.onmessage = function (event) {
    el.innerHTML = 'Server time: ' + event.data;
  };
});




;( function() {
  'use strict';

  var app = angular.module('myApp3', []);

  app.controller('myApp3ControllerMain',
    ['$scope', 'pollStorage',
    function ($scope, pollStorage) {

      $scope.time = undefined;

  }]); // app.controller('myApp1Controller', ...

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
