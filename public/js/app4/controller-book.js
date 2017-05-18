/* file: controller-book.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .controller('myApp4ControllerBook', [
    '$scope', '$window', '$timeout', 'bookStorage', 'WebSocketService', 'MyError',
    function ($scope, $window, $timeout, bookStorage, WebSocketService, MyError) {

      $scope.init = function(logintype,uid,username,bookId) {
        $scope.logintype = logintype==='undefined' ? '' : logintype;
        $scope.uid = uid==='undefined' ? '' : uid;
        $scope.username = username==='undefined' ? '' : username;
        $scope.bookId = bookId==='undefined' ? '' : bookId;
        bookRefresh({details:1, bids:1});
      };

      bookRefresh({details:1, bids:1});

      function bookRefresh(opts) {

        $scope.bidIdx = -1;

        if ($scope.bookId) {

          bookStorage.getBook($scope.bookId)

          .then( function(res) {

            var cur = $scope.curBook;
            var newData = res.data;

            if (!$scope.curBook) $scope.curBook = {};


            // Get book details
            if (opts && opts.details && newData) {

              $scope.curBook.title        = newData.title;
              $scope.curBook._id          = newData._id;
              $scope.curBook.price        = newData.price;
              $scope.curBook.ownerId      = newData.ownerId;
              $scope.curBook.ownerName    = newData.ownerName;
              $scope.curBook.keywords     = newData.keywords;
              $scope.curBook.description  = newData.description;
              $scope.curBook.photoId      = newData.photoId;


              // description: show more/show less
              var s = String($scope.curBook.description);
              if (s.length > 200) {
                $scope.curBook.descriptionShort = s.substr(0, 200);
                $scope.curBook.short = true;
              }
            }

            // Get bids
            if (opts && opts.bids && newData && newData.bids) {

              if (!$scope.curBook.bids) $scope.curBook.bids = [];

              // Add new bid or refresh existing bid
              newData.bids.forEach( function(newBid) {
                var foundBidIdx;
                var found = $scope.curBook.bids.some( function(oldBid, idx) {
                  foundBidIdx = idx;
                  return oldBid._id === newBid._id;
                });
                if(!found) { // Add new bid
                  $scope.curBook.bids.push(newBid);
                } else { // refresh existing bid
                  $scope.curBook.bids[foundBidIdx].price = newBid.price;
                }
              });


              // Filter bid.msgs
              $scope.curBook.bids.forEach( function(bid) {
                if (!bid.msgs) bid.msgs = [];
                // bid.msgs.forEach( function(msg) {
                //   msg.time = new Date(msg.time);
                // });
              });

              // Prepare bid price for update
              $scope.curBook.bids.forEach( function(bid) { bid.updateBidPrice = bid.price; });

              // Check if user has bid
              $scope.curBook.hasBid = $scope.curBook.bids.some( function(bid,idx) {
                var found = bid.by._id === $scope.uid;
                if (found) {
                  $scope.bidIdx = idx;
                  if (!bid.focusMe) bid.focusMe = true;
                }
                return found;
              });
            }

            if(opts && !opts.noreset) $scope.bookEditCancelChanges(); // reset newBook=curBook
          })

          .catch( function(res) {
            $scope.curBook = null;
            $scope.newBook = null;
            MyError.alert(res);
          })

          .then( function() {
            WebSocketService.subscribe(
              $scope.bookId,
              $scope.uid,
              receiveMessage
            );
          });

        }

      } // function bookRefresh(...)

      $scope.chooseBid = function(bid) {

        if (confirm('Do you really want to finish trade with price $'+
          bid.price+'?'))
        {
          bookStorage.chooseBid($scope.curBook._id, bid.by._id)
          .catch( function(res) { MyError.alert(res); });
        }

      }; // $scope.chooseBid = function(...)

      $scope.addBid = function() {

        bookStorage.addBid($scope.curBook._id, $scope.newBidPrice)
        .catch( function(res) { MyError.alert(res); });

      }; // $scope.addBid = function(...)

      $scope.updateBid = function(check, curPrice, newPrice) {
        if (check && curPrice !== newPrice) {
          bookStorage.addBid($scope.curBook._id, newPrice)
          .catch( function(res) { MyError.alert(res); });
        }
      }; // $scope.updateBid = function(...)

      $scope.bookEditCancelChanges = function() {

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

      }; // $scope.bookEditCancelChanges = function(...)

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
      }; // $scope.goBooksPage = function(...)


      function receiveMessage(data) {
        var bidById, msgBy;
        if (data.msgtype==='app4-broadcast-refresh-bids') {
          bookRefresh({bids:1});
        } else if (data.msgtype==='app4-broadcast-refresh-details') {
          bookRefresh({details:1});
        } else if (data.msgtype==='app4-message') {
          if ($scope.curBook.ownerId === data.to) {
            // Message from bidder to book owner
            bidById = data.from;

            var name;
            $scope.curBook.bids.some( function(bid) { name = bid.by.name; return bid.by._id === bidById; });
            msgBy = {_id: data.from, name: name};
          } else {
            // Message from book owner to bidder
            bidById = data.to;
            msgBy = {_id: data.from, name: $scope.curBook.ownerName};
          }

          // Filter bid.msgs
          var bidIdx;
          var found = $scope.curBook.bids.some( function(bid,idx) {
            bidIdx = idx;
            return bid.by._id === bidById;
          });
          if (found) {
            var msg = {
              by: msgBy,
              at: data.time,
              text: data.text,
            };
            $scope.curBook.bids[bidIdx].msgs.push(msg);
            $scope.$apply();
          }

        }
      }

      $scope.sendMsg = function(bid, from, to) {
        if (bid.newMsg) {
          var msg = {
            by: {_id: $scope.uid, name: $scope.username},
            at: new Date(),
            text: bid.newMsg,
          };
          WebSocketService.sendMessage($scope.curBook._id,from,to,new Date(),bid.newMsg);
          bid.msgs.push(msg);
          bid.newMsg = '';
        }
      }; // $scope.sendMsg = function(...)


  }]); // .controller('myApp4ControllerBook', ...

})();
