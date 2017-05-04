/* file: controller-book.js */
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

        $scope.bidIdx = -1;

        if ($scope.bookId) {

          bookStorage.getBook($scope.bookId)

          .then( function(res) {
            $scope.curBook = res.data;

            // description: show more/show less
            if ($scope.curBook) {
              var s = String($scope.curBook.description);
              if (s.length > 200) {
                $scope.curBook.descriptionShort = s.substr(0, 200);
                $scope.curBook.short = true;
                $scope.curBook.noShort = false;
              } else {
                $scope.curBook.noShort = true;
              }
            }

            // Filter bids
            if ($scope.curBook.bids) {

              // Prepare bid price for update
              $scope.curBook.bids.forEach( function(bid) { bid.updateBidPrice = bid.price; });

              // Check if user has bid
              $scope.curBook.hasBid = $scope.curBook.bids.some( function(bid,idx) {
                var found = bid.by._id === $scope.uid;
                if (found) {
                  $scope.bidIdx = idx;
                }
                return found;
              });
            }

            // Error messages processing for updating price
            if ($scope.bidIdx >= 0) {

              var priceRequiredId = '#priceRequired'+$scope.bidIdx,
                priceMinId = '#priceMin'+$scope.bidIdx,
                priceNumberId = '#priceNumber'+$scope.bidIdx,
                popoverIds = [priceRequiredId, priceMinId, priceNumberId];

              if ($scope.clearPreviousWatch) {
                $scope.clearPreviousWatch();

                // Destroy popovers
                popoverIds.forEach( function(id) { $(id).popover('destroy'); });
              }

              // Init popovers
              popoverIds.forEach( function(id) { $(id).popover(); });

              // Hide/show popovers
              $scope.clearPreviousWatch =
                $scope.$watch(
                  'updateBidForm[\'price'+$scope.bidIdx+'\'].$error',
                  function(newData, oldData) {

                    if (!(oldData && oldData.required) && newData && newData.required) {
                      $(priceRequiredId).popover('show');
                      $(priceMinId)     .popover('hide');
                      $(priceNumberId)  .popover('hide');
                    }

                    if (!(oldData && oldData.min) && newData && newData.min) {
                      $(priceRequiredId).popover('hide');
                      $(priceMinId)     .popover('show');
                      $(priceNumberId)  .popover('hide');
                    }

                    if (!(oldData && oldData.number) && newData && newData.number) {
                      $(priceRequiredId).popover('hide');
                      $(priceMinId)     .popover('hide');
                      $(priceNumberId)  .popover('show');
                    }

                    if (newData && !newData.required && !newData.min && !newData.number) {
                      $(priceRequiredId).popover('hide');
                      $(priceMinId)     .popover('hide');
                      $(priceNumberId)  .popover('hide');
                    }

                  },
                  true
                ); // scope.$watch('data',...)
            }

            $scope.bookCancelChanges(); // reset newBook=curBook
          })

          .catch( function(res) {
            $scope.curBook = null;
            $scope.newBook = null;
            MyError.alert(res);
          });

        }

      } // function bookRefresh(...)

      $scope.addBid = function() {

        bookStorage.addBid($scope.curBook._id, $scope.newBidPrice)
        .then( function(res) { bookRefresh(); })
        .catch( function(res) { MyError.alert(res); });

      }; // $scope.addBid = function(...)

      $scope.updateBid = function(curPrice, newPrice) {
        if (curPrice !== newPrice) {
          bookStorage.addBid($scope.curBook._id, newPrice)
          .then( function(res) { bookRefresh(); })
          .catch( function(res) { MyError.alert(res); });
        }
      }; // $scope.updateBid = function(...)

      $scope.bookCancelChanges = function() {

        if ($scope.curBook) {

            $scope.newBook = {};
            $scope.newBook.title        = $scope.curBook.title;
            $scope.newBook._id          = $scope.curBook._id;
            $scope.newBook.price        = $scope.curBook.price;
            $scope.newBook.ownerId      = $scope.curBook.ownerId;
            $scope.newBook.ownerName    = $scope.curBook.ownerName;
            $scope.newBook.keywords     = $scope.curBook.keywords;
            $scope.newBook.description  = $scope.curBook.description;
            $scope.newBook.photoId      = $scope.curBook.photoId;

            $scope.clearFile();

        }

      }; // $scope.bookCancelChanges = function(...)

      $scope.clearFile = function() {
        $scope.myBookEditForm.file.$setValidity("maxSize", true);
        $scope.newBook.file = null;
      };

      $scope.bookSaveChanges = function() {

        $scope.newBook.title = $scope.newBook.title.trim();
        $scope.newBook.keywords = $scope.newBook.keywords.trim();
        $scope.newBook.description = $scope.newBook.description.trim();

        if ($scope.newBook.title) {

          bookStorage.postBook($scope.newBook)

          .then( function(res) {
            bookRefresh();
          })

          .catch( function(res) {
            // Report error during book update
            MyError.alert(res);
          });

        }

      }; // $scope.bookSaveChanges = function(...)

      $scope.bookDelete = function() {

        if ($scope.newBook) {

          if (confirm('Do you really want to delete the book?')) {

            bookStorage.bookDelete($scope.newBook._id)

            .then( function onOk(res) {
              $scope.goBooksPage();
            })

            .catch( function onErr(res) {
              // Report error during poll deletion
              MyError.alert(res);
            });

          }

        }

      }; // $scope.bookDelete = function(...)

      $scope.goBooksPage = function() {
        $window.location.href = '/app4/books'; // return to books page
      };

  }]); // .controller('myApp4ControllerBook', ...

})();
