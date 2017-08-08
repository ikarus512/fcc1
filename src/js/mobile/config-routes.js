/* file: config-routes.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .config([
        '$routeProvider',
        function appConfigRoute($routeProvider) {

            $routeProvider

            .when('/',                    {templateUrl: 'views/home.html'})
            .when('/login',               {templateUrl: 'views/login.html'})

            .when('/app1/polls',          {templateUrl: 'views/app1_polls.html'})
            .when('/app1/polls/:pollId',  {templateUrl: 'views/app1_poll.html'})
            .when('/app2/cafes',          {templateUrl: 'views/app2_nightlife.html'})
            .when('/app3',                {templateUrl: 'views/app3_stock.html'})
            .when('/app4/books',          {templateUrl: 'views/app4_books.html'})
            .when('/app4/books/:bookId',  {templateUrl: 'views/app4_book.html'})
            .when('/app5',                {templateUrl: 'views/app5_pinter.html'})

            .otherwise({redirectTo: '/'});

        } // function appConfigRoute(...)

    ]); // .config(...)

}());
