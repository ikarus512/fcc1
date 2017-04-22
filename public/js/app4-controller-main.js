/* file: app4-controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myApp4')

  .controller('myApp4Controller',
    ['$scope', 'bookStorage',
    function ($scope, bookStorage) {

      $scope.mode = 'books'; // books/addBook
      $scope.newBook = {
        title: '',
        keywords: '',
        description: '',
        file: null,
      };
      $scope.books = [];

      booksRefresh();
      function booksRefresh() {
        bookStorage.getBooks()
        .then( function(res) { $scope.books=res.data; } )
        .catch( function(res) { console.log(res.data.message); } );
      }

      $scope.init = function(logintype) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
      };

      $scope.modeAddBook = function() {
        $scope.mode = 'addBook';
      };

      $scope.modeAddBookCancel = function() {
        $scope.newBook = {
          title: '',
          keywords: '',
          description: '',
          file: null,
        };

        $scope.mode = 'books';
      };

      $scope.newBookAdd = function() {

        $scope.newBook.title = $scope.newBook.title.trim();
        $scope.newBook.keywords = $scope.newBook.keywords.trim();
        $scope.newBook.description = $scope.newBook.description.trim();

        if ($scope.newBook.title) {

          bookStorage.postBook($scope.newBook)

          .then( function(res) {
            booksRefresh();
            $scope.modeAddBookCancel();
          })

          .catch( function(res) {
            // Report error during book creation
            alert(res.data.message);
          });

        }


      }; // $scope.newBookAdd = function(...)

  }]); // .controller('myApp4Controller', ...

})();
