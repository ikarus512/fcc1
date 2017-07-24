/* file: factory-storage-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .factory('StoragePoll', ['$http', 'MyConst', function ($http, MyConst) {
        return {
            get: function (pollId) {
                return $http({
                    method: 'GET',
                    data: {},
                    url: MyConst.serverUrl + '/app1/api/polls/' + pollId
                });
            },

            delete: function (pollId) { // delete poll
                return $http({
                    method: 'DELETE',
                    data: {},
                    url: MyConst.serverUrl + '/app1/api/polls/' + pollId
                });
            },

            post: function (pollId, title) { // create new option
                return $http({
                    method: 'POST',
                    data: {title: title},
                    url: MyConst.serverUrl + '/app1/api/polls/' + pollId + '/options'
                });
            },

            put: function (pollId, optId) { // vote for poll option
                return $http({
                    method: 'PUT',
                    data: {},
                    url:
                        MyConst.serverUrl +
                        '/app1/api/polls/' +
                        pollId +
                        '/options/' +
                        optId +
                        '/vote'
                });
            },

        };

    }]);

})();
