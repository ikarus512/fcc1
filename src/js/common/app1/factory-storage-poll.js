/* file: factory-storage-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('myapp')

    .factory('StoragePoll', ['$http', 'MyConst', function StoragePoll($http, MyConst) {
        return {
            get: function getPoll(pollId) {
                return $http({
                    method: 'GET',
                    data: {},
                    url: MyConst.serverUrl + '/app1/api/polls/' + pollId
                });
            },

            delete: function deletePoll(pollId) { // delete poll
                return $http({
                    method: 'DELETE',
                    data: {},
                    url: MyConst.serverUrl + '/app1/api/polls/' + pollId
                });
            },

            post: function postPoll(pollId, title) { // create new option
                return $http({
                    method: 'POST',
                    data: {title: title},
                    url: MyConst.serverUrl + '/app1/api/polls/' + pollId + '/options'
                });
            },

            put: function putPoll(pollId, optId) { // vote for poll option
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
            }

        };

    }]);

}());
