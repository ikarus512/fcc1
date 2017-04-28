/* file: app4-controller-book.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('myApp4ControllerBook', [
    '$scope', '$window', '$timeout', 'bookStorage', 'MyError',
    function ($scope, $window, $timeout, bookStorage, MyError) {

      $scope.init = function(logintype,uid,bookId) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
        $scope.uid = uid==='undefined' ? '' : uid;
        $scope.bookId = bookId==='undefined' ? '' : bookId;
        bookRefresh();
      };

      bookRefresh();

      function bookRefresh() {

        if ($scope.bookId) {

          bookStorage.getBook($scope.bookId)

          .then( function(res) {
            $scope.books = [res.data];
            if ($scope.books.length) {
              var s = String($scope.books[0].description);
              if (s.length > 200) {
                $scope.books[0].descriptionShort = s.substr(0, 200);
                $scope.books[0].short = true;
                $scope.books[0].noShort = false;
              } else {
                $scope.books[0].noShort = true;
              }
            }
            $scope.bookCancelChanges(); // reset book=books[0]
          })

          .catch( function(res) {
            $scope.books = [];
            $scope.book = null;
            MyError.alert(res);
          });

        }

      } // function bookRefresh(...)

      $scope.bookCancelChanges = function() {

        if ($scope.books.length) {

            $scope.book = {};
            $scope.book.title        = $scope.books[0].title;
            $scope.book._id          = $scope.books[0]._id;
            $scope.book.price        = $scope.books[0].price;
            $scope.book.createdBy    = $scope.books[0].createdBy;
            $scope.book.keywords     = $scope.books[0].keywords;
            $scope.book.description  = $scope.books[0].description;
            $scope.book.photoId      = $scope.books[0].photoId;

            $scope.clearFile();

        }

      }; // $scope.bookCancelChanges = function(...)

      $scope.clearFile = function() {
        $scope.myForm.file.$setValidity("maxSize", true);
        $scope.book.file = null;
      };

      $scope.bookSaveChanges = function() {

        $scope.book.title = $scope.book.title.trim();
        $scope.book.keywords = $scope.book.keywords.trim();
        $scope.book.description = $scope.book.description.trim();

        if ($scope.book.title) {

          bookStorage.postBook($scope.book)

          .then( function(res) {
            bookRefresh();
          })

          .catch( function(res) {
            // Report error during book creation
            MyError.alert(res);
          });

        }

      }; // $scope.bookSaveChanges = function(...)

      $scope.bookDelete = function() {

        if ($scope.book._id) {

          if (confirm('Do you really want to delete the book?')) {

            bookStorage.bookDelete($scope.book._id)

            .then( function onOk(res) {
              $scope.goBooksPage();
            })

            .catch( function onErr(res) {
              // Report error during poll deletion
              alert(res.data.message);
              if (res.data) alert(res.data.message);
            });

          }

        }

      }; // $scope.bookDelete = function(...)

      $scope.goBooksPage = function() {
        $window.location.href = '/app4/books'; // return to books page
      };

  }]); // .controller('myApp4ControllerBook', ...

})();
