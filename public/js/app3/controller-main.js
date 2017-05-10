/* file: controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('myApp3ControllerMain',
    ['$scope', 'RestService', 'WebSocketService',
    function ($scope, RestService, WebSocketService) {

      $scope.init = function(logintype,username) {
        $scope.logintype = logintype==='undefined' ? undefined : logintype;
      }; // $scope.init(...)

      var APP3_STOCK_PORTION_LENGTH = 5,
        APP3_STOCK_MAX_LENGTH = 4 * APP3_STOCK_PORTION_LENGTH;

      function initData() {
        var i,j, d = new Date(), data = {}, stockNames = ['initialZeroLine'];

        data.x = [];
        for (i=0; i<APP3_STOCK_MAX_LENGTH; i++ ) {
          data.x.push( new Date(d.getTime()-(APP3_STOCK_MAX_LENGTH-i)*0.5*1000) );
        }

        data.stocks = {};
        stockNames.forEach( function(stockName) {
          data.stocks[stockName] = {};
          data.stocks[stockName].id = stockName;
          data.stocks[stockName].values = [];
          for (i=0; i<APP3_STOCK_MAX_LENGTH; i++ ) {
            data.stocks[stockName].values.push({
              x: new Date(data.x[i]),
              y: 0
            });
          }
        });

        return data;
      } // function initData(...)

      $scope.chart1Data = {
        title: 'Title',
        note: 'Description',
        data: initData(),
      };




      $scope.addStockName = function(stockName) {
        WebSocketService.addStockName(stockName);
      };

      $scope.removeStockName = function(stockName) {
        WebSocketService.removeStockName(stockName);
      };

      WebSocketService.subscribe( function(newDataPortion) {
        var key, newData = $scope.chart1Data;

        // newDataPortion update: convert all dates from String() to Date()
        newDataPortion.data.x = newDataPortion.data.x.map( function(el) { return new Date(el); });
        function cvtToDate(el) { el.x = new Date(el.x); }
        for (key in newDataPortion.data.stocks) {
          newDataPortion.data.stocks[key].values.forEach(cvtToDate);
        }


        // Remove old data portion
        if (newData.data.x.length >= APP3_STOCK_MAX_LENGTH) {
          newData.data.x.splice(0, APP3_STOCK_PORTION_LENGTH);
        }
        function isNew(el) { return (el.x.getTime() >= newData.data.x[0].getTime()); }
        for (key in newData.data.stocks) {
          // Filter out old stock data by date
          newData.data.stocks[key].values = newData.data.stocks[key].values.filter(isNew);
          // Remove empty stock data
          if (newData.data.stocks[key].values.length < 2) {
            delete newData.data.stocks[key];
          }
        }


        // Add new data portion
        newData.data.x = newData.data.x.concat(newDataPortion.data.x);
        for (key in newDataPortion.data.stocks) {
          // If key was absent
          if (!newData.data.stocks[key])
            newData.data.stocks[key] = {id: key, values: []};

          newData.data.stocks[key].values = newData.data.stocks[key].values
            .concat(newDataPortion.data.stocks[key].values);
        }


        $scope.chart1Data = newData;

        // Refresh scope
        $scope.$apply();
      });

  }]); // .controller('myApp3ControllerMain', ...

})();