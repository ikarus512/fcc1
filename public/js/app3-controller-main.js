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

      $scope.init = function(logintype,username) {
        $scope.logintype = logintype==='undefined' ? undefined : logintype;
        $scope.username = username;
      }; // $scope.init(...)

      var DATA_MAX_LENGTH = 20;
      var DATA_PORTION_LENGTH = 5;
      function initData() {
        var i,j, d = new Date(), data = {}, stockNames = ['stock1', 'stock2', 'stock3'];

        data.x = [];
        for (i=0; i<=DATA_MAX_LENGTH; i++ ) {
          data.x.push( new Date(d.getTime()-(DATA_MAX_LENGTH-i)*0.5*1000) );
        }

        data.stocks = [];
        stockNames.forEach( function(stockName) {
          var stock = {};
          stock.id = stockName;
          stock.values = [];
          for (i=0; i<=DATA_MAX_LENGTH; i++ ) {
            // data.stocks[stockName].push(0);
            stock.values.push({
              x: data.x[i],
              y: Math.random()*300
            });
          }
          data.stocks.push(stock);
        });

        return data;
      }

      $scope.chart1Data = {
        title: 'Title',
        note: 'Description',
        data: initData(),
      };

      WebSocketService.subscribe( function(data) {
        // // Remove old data portion
        // if ($scope.chart1Data.data.length >= DATA_MAX_LENGTH) {
        //   $scope.chart1Data.data.splice(0,DATA_PORTION_LENGTH);
        // }

        // // Read and add new data portion
        // $scope.chart1Data.data.push([data.x,data.y]);

        // // Refresh scope
        // $scope.$apply();
      });

  }]); // .controller('myApp3ControllerMain', ...

})();
