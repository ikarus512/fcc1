/* file: controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;(function() {
    'use strict';

    angular.module('myapp')

    .controller('myApp4Controller', [
      '$scope', 'bookStorage', 'MyError', 'MyConst', 'User', 'backendParams',
      function ($scope, bookStorage, MyError, MyConst, User, backendParams) {

        $scope.ajaxLoadingSpinner = 0;

        // Init params from backend
        if (MyConst.webApp) {
            $scope.logintype =
              (backendParams.logintype && backendParams.logintype !== 'undefined') ?
              backendParams.logintype : '';
            $scope.username =
              (backendParams.username && backendParams.username !== 'undefined') ?
              backendParams.username : '';
        } else {
            $scope.ajaxLoadingSpinner++;
            User.check()
            .then(function() {
                $scope.logintype = User.type;
                $scope.username  = User.name;
            })
            .finally(function() {$scope.ajaxLoadingSpinner--;});
        }
        $scope.urlPrefix = MyConst.urlPrefix;
        $scope.serverUrl = MyConst.serverUrl;

        $scope.mode = 'books'; // books/addBook
        $scope.newBook = null;
        $scope.books = [];

        booksRefresh();
        function booksRefresh() {
            $scope.ajaxLoadingSpinner++;
            bookStorage.getBooks()
            .then(function(res) { $scope.books = res.data; })
            .catch(function(res) { MyError.alert(res); })
            .finally(function() {$scope.ajaxLoadingSpinner--;});
        }

        $scope.clearFile = function() {
            $scope.myAddBookForm.file.$setValidity('maxSize', true);
            $scope.newBook.file = null;
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

                $scope.ajaxLoadingSpinner++;

                bookStorage.postBook($scope.newBook)

                .then(function(res) {
                    booksRefresh();
                    $scope.modeAddBookCancel();
                })

                .catch(function(res) {
                    // Report error during book creation
                    MyError.alert(res);
                })

                .finally(function() {$scope.ajaxLoadingSpinner--;});

            }

        }; // $scope.newBookAdd = function(...)

    }]); // .controller('myApp4Controller', ...

})();
