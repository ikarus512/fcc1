/* file: factory-book-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular
    .module('app4book')
    .factory('bookStorage', bookStorage);

    bookStorage.$inject = [
        '$http', 'Upload', 'MyConst'
    ];

    function bookStorage($http, Upload, MyConst) {

        return {
            getBook: getBook,
            bookDelete: bookDelete,
            postBook: postBook,
            addBid: addBid,
            chooseBid: chooseBid,
            getWsTicket: getWsTicket
        };

        ////////////////////////////////////////

        function getBook(id) {
            return $http({
                method: 'GET',
                data:{},
                url: MyConst.serverUrl + '/app4/api/books/' + id
            });
        } // function getBook(...)

        function bookDelete(id) {
            return $http({
                method: 'DELETE',
                data:{},
                url: MyConst.serverUrl + '/app4/api/books/' + id
            });
        } // function bookDelete(...)

        function postBook(book) {
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
        } // function postBook(...)

        function addBid(id, price) {
            return $http({
                method: 'POST',
                data: {price:price},
                url: MyConst.serverUrl + '/app4/api/books/' + id + '/bid'
            });
        } // function addBid(...)

        function chooseBid(bookId, bidOwnerId) {
            return $http({
                method: 'POST',
                data: {bidOwnerId:bidOwnerId},
                url: MyConst.serverUrl + '/app4/api/books/' + bookId + '/choose'
            });
        } // function chooseBid(...)

        function getWsTicket() {
            return $http({
                method: 'GET',
                data:{},
                url: MyConst.serverUrl + '/app4/api/get-ws-ticket'
            });
        } // function getWsTicket(...)

    } // function bookStorage(...)

}());
