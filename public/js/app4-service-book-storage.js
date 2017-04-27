/* file: app4-service-book-storage.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myApp4')

  .factory('bookStorage',
    ['$http', 'Upload',
    function ($http, Upload) {

      return {
        getBook: function(id) {
          return $http({
            method: 'GET',
            data:{},
            url: '/app4/api/books/'+id
          });
        },

        bookDelete: function(id) {
          return $http({
            method: 'DELETE',
            data:{},
            url: '/app4/api/books/'+id
          });
        },

        getBooks: function () {
          return $http({
            method: 'GET',
            data:{},
            url: '/app4/api/books'
          });
        },

        postBook: function (book) {
          if (book.file) {
            return Upload.upload({
              method: 'POST',
              data: book,
              url: '/app4/api/books'
            });
          } else {
            return $http({
              method: 'POST',
              data: book,
              url: '/app4/api/books'
            });
          }
        },

      };

  }]); // .factory('bookStorage', ...

})();
