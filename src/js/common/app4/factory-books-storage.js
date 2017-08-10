/* file: factory-books-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular
    .module('app4books')
    .factory('booksStorage', booksStorage);

    booksStorage.$inject = [
        '$http', 'Upload', 'MyConst'
    ];

    function booksStorage($http, Upload, MyConst) {

        return {
            getBooks: getBooks,
            postBook: postBook
        };

        ////////////////////////////////////////

        function getBooks() {
            return $http({
                method: 'GET',
                data:{},
                url: MyConst.serverUrl + '/app4/api/books'
            });
        } // function getBooks(...)

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

    } // function booksStorage(...)

}());
