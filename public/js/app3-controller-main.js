/* file: app3-controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myApp3')

  .controller('myApp3ControllerMain',
    ['$scope', 'RestService', 'WebSocketService',
    function ($scope, RestService, WebSocketService) {

      var d = new Date();
      var data = [];
      var i, DATA_LENGTH = 20;
      for (i=0; i<=DATA_LENGTH; i++ ) {
        data.push([d.getTime()-(DATA_LENGTH-i)*0.5*1000,0]);
      }

      $scope.chart1Data = {
        name: 'Title',
        description: 'Description',
        data : data,
      };

      WebSocketService.subscribe( function(data) {
        if ($scope.chart1Data.data.length >= DATA_LENGTH)
          $scope.chart1Data.data.splice(0,1);
        $scope.chart1Data.data.push([data.x,data.y]);
        $scope.$apply();
      });

  }]); // .controller('myApp3ControllerMain', ...

})();
