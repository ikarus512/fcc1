/* file: controller-main.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .controller('myApp2ControllerMain', [
        '$scope', 'cafeStorage', 'MyError', 'MyConst', 'User', 'backendParams',
        // eslint-disable-next-line complexity, max-statements
        function myApp2ControllerMain($scope, cafeStorage, MyError, MyConst, User, backendParams) {

            var APP2_MAX_TIMESLOTS = 4;
            var APP2_TIMESLOT_LENGTH = 30; // timeslot length in minutes (must divide 60)

            $scope.ajaxLoadingSpinner = 0;
            $scope.ajaxLoadingSpinnerSmall = 0;

            $scope.cafes = [];
            $scope.selectedCafeId = undefined;
            $scope.zoom = 16;
            $scope.center = {lat: 56.312956, lng: 43.989955}; // Nizhny
            $scope.radius = 188.796;

            // Init params from backend
            if (MyConst.webApp) {
                $scope.logintype =
                  (backendParams.logintype && backendParams.logintype !== 'undefined') ?
                  backendParams.logintype : '';
                $scope.username =
                  (backendParams.username && backendParams.username !== 'undefined') ?
                  backendParams.username : '';

                var p = backendParams,
                  lat = (p.lat && p.lat !== 'undefined') ? p.lat : '',
                  lng = (p.lng && p.lng !== 'undefined') ? p.lng : '',
                  zoom = (p.zoom && p.zoom !== 'undefined') ? p.zoom : '',
                  radius = (p.radius && p.radius !== 'undefined') ? p.radius : '';
                lat = Number(lat); lng = Number(lng); zoom = Number(zoom); radius = Number(radius);
                if (isFinite(lat)) { $scope.center.lat = lat; }
                if (isFinite(lng)) { $scope.center.lng = lng; }
                if (isFinite(zoom)) { $scope.zoom = zoom; }
                if (isFinite(radius)) { $scope.radius = radius; }

                if (p.selectedCafeId && p.selectedCafeId !== 'undefined') {
                    var interval = setInterval(function() { // Wait until map ready
                        if ($scope.mapInit) {
                            $scope.listSelectedCafe(p.selectedCafeId); // select cafe when map ready
                            clearInterval(interval);
                        }
                    }, 100);
                }

            } else {
                $scope.ajaxLoadingSpinner++;
                User.check()
                .then(function() {
                    $scope.logintype = User.type;
                    $scope.username  = User.name;
                })
                .finally(function() {$scope.ajaxLoadingSpinner--;});
            }

            $scope.onMapInit = onMapInit;
            $scope.onPlan = onPlan;
            $scope.onUnplan = onUnplan;
            $scope.cafesUnselect = cafesUnselect;
            $scope.listSelectedCafe = listSelectedCafe;
            $scope.mapSelectedCafe = mapSelectedCafe;
            $scope.cafeSelect = cafeSelect;
            $scope.mapMoved = mapMoved;

            cafesRefresh();

            ////////////////////////////////////////

            function onMapInit() { $scope.mapInit = true; }

            function onPlan(cafe, timeslot) {
                if ($scope.username) {
                    $scope.ajaxLoadingSpinner++;
                    cafeStorage.planCafeTimeslot(cafe._id, timeslot.start)
                    .finally(function() {$scope.ajaxLoadingSpinner--;})
                    .then(function(res) {
                        timeslot.planned = true;
                        timeslot.users.push($scope.username);
                    })
                    .catch(function(res) {
                        // Errors like date in the past, no such cafe, etc
                        MyError.alert(res);
                    });
                }
            } // function onPlan(...)

            function onUnplan(cafe, timeslot) {
                if ($scope.username) {
                    $scope.ajaxLoadingSpinner++;
                    cafeStorage.unplanCafeTimeslot(cafe._id, timeslot.start)
                    .finally(function() {$scope.ajaxLoadingSpinner--;})
                    .then(function(res) {
                        timeslot.planned = false;
                        timeslot.users.splice(timeslot.users.indexOf($scope.username),1);
                    })
                    .catch(function(res) {
                        // Errors like date in the past, no such cafe, etc
                        MyError.alert(res);
                    });
                }
            } // function onUnplan(...)

            function cafesUnselect() {
                $scope.cafes.forEach(function(cafe) { cafe.show = true; cafe.selected = false; });
                if ($scope.selectedCafeId) { $scope.selectedCafeId = undefined; }
            } // function cafesUnselect(...)

            function listSelectedCafe(_id) {
                if ($scope.selectedCafeId !== _id) { $scope.selectedCafeId = _id; }
                $scope.cafeSelect(_id);
            } // function listSelectedCafe(...)

            function mapSelectedCafe(_id) {
                if ($scope.selectedCafeId !== _id) { $scope.selectedCafeId = _id; }
                $scope.cafeSelect(_id);
            } // function mapSelectedCafe(...)

            function cafeSelect(_id) {
                var selCafe;
                $scope.cafes.forEach(function(cafe) {
                    cafe.show = cafe.selected = false;
                    if (cafe._id === _id) {
                        selCafe = cafe;
                        cafe.show = cafe.selected = true;
                    }
                });
                $scope.ajaxLoadingSpinnerSmall++;
                cafeStorage.updateSessionState(
                    $scope.location,
                    $scope.radius,
                    $scope.zoom,
                    $scope.selectedCafeId
                )
                .finally(function() { $scope.ajaxLoadingSpinnerSmall--; });

                // Refresh timeslots in selected cafe
                refreshCafeTimeslots(selCafe);

            } // function cafeSelect(...)

            function refreshCafeTimeslots(cafe) {
                if (cafe) {
                    var start = new Date();
                    start.setMinutes(
                        Math.floor(start.getMinutes() / APP2_TIMESLOT_LENGTH) * APP2_TIMESLOT_LENGTH
                    );
                    start.setSeconds(0); start.setMilliseconds(0);
                    // 1) remove old timeslots
                    if (!cafe.timeslots) { cafe.timeslots = []; }
                    cafe.timeslots = cafe.timeslots.filter(function(timeslot) {
                        return timeslot.start >= start;
                    });
                    // 2) add new nearest timeslots
                    var i, t, times = []; // array of start times of nearest timeslots
                    for (i = 0; i < APP2_MAX_TIMESLOTS; i++) {
                        t = new Date(start);
                        t.setMinutes(t.getMinutes() + i * APP2_TIMESLOT_LENGTH);
                        times.push(new Date(t));
                    }
                    times.forEach(function(t) {
                        // Check if timeslot already present
                        var found = cafe.timeslots.some(function(timeslot) {
                            return (timeslot.start.getTime() === t.getTime());
                        });
                        // If timeslot not found, create it
                        if (!found) {
                            var timeslot = {start: new Date(t)};
                            cafe.timeslots.push(timeslot);
                        }
                        // Update timeslots with needed new data
                        cafe.timeslots.forEach(function(timeslot) {
                            var timeslotEnd = new Date(timeslot.start);
                            timeslotEnd.setMinutes(
                                timeslotEnd.getMinutes() + 1 * APP2_TIMESLOT_LENGTH
                            );
                            timeslot.strDate = timeslot.start.getFullYear() +
                              '/' + (timeslot.start.getMonth() + 1) +
                              '/' + timeslot.start.getDate();
                            timeslot.strHoursStart = timeslot.start.getHours();
                            timeslot.strHoursEnd   = timeslotEnd.getHours();
                            timeslot.strMinutesStart = timeslot.start.getMinutes();
                            timeslot.strMinutesEnd   = timeslotEnd.getMinutes();
                            if (timeslot.strMinutesStart < 10) {
                                timeslot.strMinutesStart = '0' + timeslot.strMinutesStart;
                            }
                            if (timeslot.strMinutesEnd < 10) {
                                timeslot.strMinutesEnd = '0' + timeslot.strMinutesEnd;
                            }
                            if (!timeslot.users) { timeslot.users = []; }
                        });
                    });
                    // 3) sort ascending
                    cafe.timeslots = cafe.timeslots.sort(function(a, b) {
                        return (a.start > b.start);
                    });
                }
            } // function refreshCafeTimeslots(...)

            function cafesRefresh() {
                setTimeout(function() {
                    // Find selected cafe
                    var selectedCafeId;
                    $scope.cafes.some(function(cafe) {
                        if (cafe.selected) { selectedCafeId = cafe._id; }
                        return cafe.selected;
                    });

                    $scope.ajaxLoadingSpinnerSmall++;
                    cafeStorage.get(
                        $scope.center,
                        $scope.radius,
                        $scope.zoom,
                        $scope.selectedCafeId
                    )
                    .finally(function() {$scope.ajaxLoadingSpinnerSmall--;})

                    .then(function(res) {
                        $scope.cafes = [];
                        var newCafes = res.data;

                        // Check if selected cafe still present among newCafes
                        var found = newCafes.some(function(cafe) {
                            return (cafe._id === selectedCafeId);
                        });
                        // Persist selected cafe
                        if (found) {
                            newCafes.forEach(function(cafe) {
                                // Show only selected cafe
                                if (cafe._id === selectedCafeId) {
                                    cafe.show = cafe.selected = true;
                                } else {
                                    cafe.show = cafe.selected = false;
                                }
                            });
                        } else {
                            if ($scope.selectedCafeId) { $scope.selectedCafeId = undefined; }
                            newCafes.forEach(function(cafe) {
                                cafe.show = true; cafe.selected = false;
                            });
                        }

                        // Convert received timeslots start field to Date type
                        newCafes.forEach(function(cafe) {
                            if (!cafe.timeslots) { cafe.timeslots = []; }
                            cafe.timeslots.forEach(function(timeslot) {
                                if (timeslot.start) { timeslot.start = new Date(timeslot.start); }
                            });
                            refreshCafeTimeslots(cafe);
                        });

                        $scope.cafes = newCafes;
                    })

                    .catch(function(res) {
                        // No connection. Do not remove cafes downloaded earlier.
                        MyError.alert(res);
                        //$scope.cafes = [];
                    });

                },0);

            } // function cafesRefresh(...)

            function mapMoved(newOpts) {
                if (newOpts.newCenter) { $scope.center = newOpts.newCenter; }
                $scope.zoom   = newOpts.newZoom;
                $scope.radius = newOpts.newRadius;
                cafesRefresh();
            } // function mapMoved(...)

        } // function myApp2ControllerMain(...)

    ]); // .controller('myApp2ControllerMain', ...

}());
