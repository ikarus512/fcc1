/* file: controller-book.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .controller('myApp4ControllerBook', [
      '$scope', '$window', '$timeout', 'bookStorage', 'App4WebSocketService',
      'MyError', '$routeParams', 'MyConst', 'User', 'backendParams',
      function ($scope, $window, $timeout, bookStorage, App4WebSocketService,
        MyError, $routeParams, MyConst, User, backendParams
      )
      {

        $scope.ajaxLoadingSpinner = 0;

        // Init params from backend
        if (MyConst.webApp) {
            $scope.logintype =
              (backendParams.logintype && backendParams.logintype !== 'undefined') ?
              backendParams.logintype : '';
            $scope.username =
              (backendParams.username && backendParams.username !== 'undefined') ?
              backendParams.username : '';
            $scope.uid =
              (backendParams.uid && backendParams.uid !== 'undefined') ?
              backendParams.uid : '';
            $scope.bookId =
              (backendParams.bookId && backendParams.bookId !== 'undefined') ?
              backendParams.bookId : '';
        } else {
            $scope.ajaxLoadingSpinner++;
            User.check()
            .then(function() {
                $scope.logintype = User.type;
                $scope.username  = User.name;
                $scope.uid       = User.uid;
            })
            .finally(function() {$scope.ajaxLoadingSpinner--;});
            $scope.bookId = $routeParams.bookId; // #!app4/books/:bookId
        }
        $scope.urlPrefix = MyConst.urlPrefix;
        $scope.serverUrl = MyConst.serverUrl;

        bookRefresh({details:1, bids:1});

        function bookRefresh(opts) {

            if ($scope.bookId) {

                $scope.ajaxLoadingSpinner++;

                bookStorage.getBook($scope.bookId)

                .then(function(res) {

                    var cur = $scope.curBook;
                    var newData = res.data;

                    if (!$scope.curBook) { $scope.curBook = {}; }

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
                        $scope.curBook.tradeFinished = newData.tradeFinished;

                        // description: show more/show less
                        var s = String($scope.curBook.description);
                        if (s.length > 200) {
                            $scope.curBook.descriptionShort = s.substr(0, 200);
                            $scope.curBook.short = true;
                        }
                    }

                    // Get bids
                    if (opts && opts.bids && newData && newData.bids) {

                        if (!$scope.curBook.bids) { $scope.curBook.bids = []; }

                        // Add new bid or refresh existing bid
                        newData.bids.forEach(function(newBid) {
                            var foundBidIdx;
                            var found = $scope.curBook.bids.some(function(oldBid, idx) {
                                foundBidIdx = idx;
                                return oldBid._id === newBid._id;
                            });
                            if (!found) { // Add new bid
                                $scope.curBook.bids.push(newBid);
                            } else { // refresh existing bid
                                $scope.curBook.bids[foundBidIdx].price = newBid.price;
                            }
                        });

                        // Filter bid.msgs
                        $scope.curBook.bids.forEach(function(bid) {
                            if (!bid.msgs) { bid.msgs = []; }
                            // bid.msgs.forEach( function(msg) {
                            //   msg.time = new Date(msg.time);
                            // });
                        });

                        // Prepare bid price for update
                        $scope.curBook.bids.forEach(function(bid) {
                            bid.updateBidPrice = bid.price;
                        });

                        // Check if user has bid
                        $scope.curBook.hasBid = $scope.curBook.bids.some(function(bid,idx) {
                            var found = bid.by._id === $scope.uid;
                            if (found) {
                                if (!bid.focusMe) { bid.focusMe = true; }
                            }
                            return found;
                        });
                    }

                    if (opts && !opts.noreset) { $scope.bookEditCancelChanges(); }
                    // ... and reset newBook=curBook
                })

                .catch(function(res) {
                    $scope.curBook = null;
                    $scope.newBook = null;
                    MyError.alert(res);
                })

                .then(function() {
                    $scope.ajaxLoadingSpinner++;
                    App4WebSocketService.subscribe(
                      $scope.bookId,
                      $scope.uid,
                      receiveMessage
                    )
                    .finally(function() {$scope.ajaxLoadingSpinner--;});
                })

                .finally(function() {$scope.ajaxLoadingSpinner--;});

            }

        } // function bookRefresh(...)

        /* On app4 close: */
        $scope.$on('$destroy', function() {
            App4WebSocketService.close();
        });

        $scope.chooseBid = function(bid) {

            if (confirm('Do you really want to finish trade with price $' +
              bid.price + '?'))
            {
                $scope.ajaxLoadingSpinner++;
                bookStorage.chooseBid($scope.curBook._id, bid.by._id)
                .catch(function(res) { MyError.alert(res); })
                .finally(function() {$scope.ajaxLoadingSpinner--;});
            }

        }; // $scope.chooseBid = function(...)

        $scope.addBid = function() {

            $scope.ajaxLoadingSpinner++;
            bookStorage.addBid($scope.curBook._id, $scope.newBidPrice)
            .catch(function(res) { MyError.alert(res); })
            .finally(function() {$scope.ajaxLoadingSpinner--;});

        }; // $scope.addBid = function(...)

        $scope.updateBid = function(check, curPrice, newPrice) {
            if (check && curPrice !== newPrice) {
                $scope.ajaxLoadingSpinner++;
                bookStorage.addBid($scope.curBook._id, newPrice)
                .catch(function(res) { MyError.alert(res); })
                .finally(function() {$scope.ajaxLoadingSpinner--;});
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
            $scope.myBookEditForm.file.$setValidity('maxSize', true);
            $scope.newBook.file = null;
        };

        $scope.bookSaveChanges = function() {

            $scope.newBook.title = $scope.newBook.title.trim();
            $scope.newBook.keywords = $scope.newBook.keywords.trim();
            $scope.newBook.description = $scope.newBook.description.trim();

            if ($scope.newBook.title) {

                $scope.ajaxLoadingSpinner++;

                bookStorage.postBook($scope.newBook)

                .catch(function(res) {
                    // Report error during book update
                    MyError.alert(res);
                })

                .finally(function() {$scope.ajaxLoadingSpinner--;});

            }

        }; // $scope.bookSaveChanges = function(...)

        $scope.bookDelete = function() {

            if ($scope.newBook) {

                if (confirm('Do you really want to delete the book?')) {

                    $scope.ajaxLoadingSpinner++;

                    bookStorage.bookDelete($scope.newBook._id)

                    .then(function onOk(res) {
                        $scope.goBooksPage();
                    })

                    .catch(function onErr(res) {
                        // Report error during poll deletion
                        MyError.alert(res);
                    })

                    .finally(function() {$scope.ajaxLoadingSpinner--;});

                }

            }

        }; // $scope.bookDelete = function(...)

        $scope.goBooksPage = function() {
            // return to books page
            $window.location.href = MyConst.urlPrefix + '/app4/books';
        }; // $scope.goBooksPage = function(...)

        function receiveMessage(data) {
            var bidById, msgBy;
            if (data.msgtype === 'app4-broadcast-refresh-bids') {
                bookRefresh({bids:1});
            } else if (data.msgtype === 'app4-broadcast-refresh-details') {
                bookRefresh({details:1});
            } else if (data.msgtype === 'app4-message') {
                if ($scope.curBook.ownerId === data.to) {
                    // Message from bidder to book owner
                    bidById = data.from;

                    var name;
                    $scope.curBook.bids.some(function(bid) {
                        name = bid.by.name;
                        return bid.by._id === bidById;
                    });
                    msgBy = {_id: data.from, name: name};
                } else {
                    // Message from book owner to bidder
                    bidById = data.to;
                    msgBy = {_id: data.from, name: $scope.curBook.ownerName};
                }

                // Filter bid.msgs
                var bidIdx;
                var found = $scope.curBook.bids.some(function(bid,idx) {
                    bidIdx = idx;
                    return bid.by._id === bidById;
                });
                if (found) {
                    // Add incoming message to messages list
                    var msg = {
                        by: msgBy,
                        at: data.time,
                        text: data.text
                    };
                    $scope.curBook.bids[bidIdx].msgs.push(msg);

                    // show talk:
                    if ($scope.curBook.ownerId === data.to) {
                        $scope.curBook.bids[bidIdx].showOwnerTalk = true;
                    } else {
                        $scope.curBook.bids[bidIdx].showBidderTalk = true;
                    }

                    $scope.$apply();
                }

            }
        }

        $scope.sendMsg = function(bid, from, to) {
            if (bid.newMsg) {
                var msg = {
                    by: {_id: $scope.uid, name: $scope.username},
                    at: new Date(),
                    text: bid.newMsg
                };
                App4WebSocketService.sendMessage($scope.curBook._id,from,to,new Date(),bid.newMsg);
                bid.msgs.push(msg);
                bid.newMsg = '';
            }
        }; // $scope.sendMsg = function(...)

    }
    ]); // .controller('myApp4ControllerBook', ...

})();
