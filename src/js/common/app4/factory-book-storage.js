/* file: factory-book-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('app4book')

    .factory('bookStorage',
        ['$http', 'Upload', 'MyConst',
        function bookStorage($http, Upload, MyConst) {

            return {
                getBook: function getBook(id) {
                    return $http({
                        method: 'GET',
                        data:{},
                        url: MyConst.serverUrl + '/app4/api/books/' + id
                    });
                },

                bookDelete: function bookDelete(id) {
                    return $http({
                        method: 'DELETE',
                        data:{},
                        url: MyConst.serverUrl + '/app4/api/books/' + id
                    });
                },

                getBooks: function getBooks() {
                    return $http({
                        method: 'GET',
                        data:{},
                        url: MyConst.serverUrl + '/app4/api/books'
                    });
                },

                postBook: function postBook(book) {
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

                addBid: function addBid(id, price) {
                    return $http({
                        method: 'POST',
                        data: {price:price},
                        url: MyConst.serverUrl + '/app4/api/books/' + id + '/bid'
                    });
                },

                chooseBid: function chooseBid(bookId, bidOwnerId) {
                    return $http({
                        method: 'POST',
                        data: {bidOwnerId:bidOwnerId},
                        url: MyConst.serverUrl + '/app4/api/books/' + bookId + '/choose'
                    });
                },

                getWsTicket: function getWsTicket() {
                    return $http({
                        method: 'GET',
                        data:{},
                        url: MyConst.serverUrl + '/app4/api/get-ws-ticket'
                    });
                }
            };

        } // function bookStorage(...)

    ]); // .factory('bookStorage', ...

}());
