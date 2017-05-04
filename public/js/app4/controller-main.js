/* file: controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('myApp4Controller', [
    '$scope', 'bookStorage', 'MyError',
    function ($scope, bookStorage, MyError) {

      $scope.mode = 'books'; // books/addBook
      $scope.newBook = null;
      $scope.books = [];

      booksRefresh();
      function booksRefresh() {
        bookStorage.getBooks()
        .then( function(res) { $scope.books=res.data; } )
        .catch( function(res) { MyError.alert(res); } );
      }

      $scope.clearFile = function() {
        $scope.myAddBookForm.file.$setValidity("maxSize", true);
        $scope.newBook.file = null;
      };

      $scope.init = function(logintype,uid) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
        $scope.uid = uid==='undefined' ? '' : uid;
      };

      $scope.modeAddBook = function(book) {
        $scope.newBook = {
          title: '',
          createdBy: undefined,
          price: undefined,
          keywords: '',
          description: '',
          file: null,
        };

        $scope.mode = 'addBook';
      };

      $scope.modeAddBookCancel = function() {
        $scope.newBook = null;
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
            MyError.alert(res);
          });

        }


      }; // $scope.newBookAdd = function(...)

  }]); // .controller('myApp4Controller', ...

})();
