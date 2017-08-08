/* file: factory-rest.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .factory('App3RestService', ['$http', 'MyConst', function App3RestService($http, MyConst) {
        return {

            getWsTicket: function getWsTicket() {
                return $http({
                    method: 'GET',
                    data:{},
                    url: MyConst.serverUrl + '/app3/api/get-ws-ticket'
                });
            }

        };

    }]); // .factory('App3RestService', ...

}());
