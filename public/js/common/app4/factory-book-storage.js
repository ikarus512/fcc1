/* file: factory-book-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;(function() {
    'use strict';

    angular.module('myapp')

    .factory('bookStorage',
      ['$http', 'Upload', 'MyConst',
      function ($http, Upload, MyConst) {

        return {
            getBook: function(id) {
                return $http({
                    method: 'GET',
                    data:{},
                    url: MyConst.serverUrl + '/app4/api/books/' + id
                });
            },

            bookDelete: function(id) {
                return $http({
                    method: 'DELETE',
                    data:{},
                    url: MyConst.serverUrl + '/app4/api/books/' + id
                });
            },

            getBooks: function () {
                return $http({
                    method: 'GET',
                    data:{},
                    url: MyConst.serverUrl + '/app4/api/books'
                });
            },

            postBook: function (book) {
                if (book.file) {
                    return Upload.upload({
                        method: 'POST',
                        data: book,
                        url: MyConst.serverUrl + '/app4/api/books'
                    });
                } else {
                    return $http({
                        method: 'POST',
                        data: book,
                        url: MyConst.serverUrl + '/app4/api/books'
                    });
                }
            },

            addBid: function (id, price) {
                return $http({
                    method: 'POST',
                    data: {price:price},
                    url: MyConst.serverUrl + '/app4/api/books/' + id + '/bid'
                });
            },

            chooseBid: function (bookId, bidOwnerId) {
                return $http({
                    method: 'POST',
                    data: {bidOwnerId:bidOwnerId},
                    url: MyConst.serverUrl + '/app4/api/books/' + bookId + '/choose'
                });
            },

            getWsTicket: function () {
                return $http({
                    method: 'GET',
                    data:{},
                    url: MyConst.serverUrl + '/app4/api/get-ws-ticket'
                });
            },
        };

    }]); // .factory('bookStorage', ...

})();
