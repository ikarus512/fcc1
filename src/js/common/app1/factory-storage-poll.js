/* file: factory-storage-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular
    .module('myapp')
    .factory('StoragePoll', StoragePoll);

    StoragePoll.$inject = ['$http', 'MyConst'];

    function StoragePoll($http, MyConst) {
        return {
            get: getPoll,
            delete: deletePoll,
            post: postPoll,
            put: putPoll
        };

        ////////////////////////////////////////

        function getPoll(pollId) {
            return $http({
                method: 'GET',
                data: {},
                url: MyConst.serverUrl + '/app1/api/polls/' + pollId
            });
        } // function getPoll(...)

        function deletePoll(pollId) { // delete poll
            return $http({
                method: 'DELETE',
                data: {},
                url: MyConst.serverUrl + '/app1/api/polls/' + pollId
            });
        } // function deletePoll(...)

        function postPoll(pollId, title) { // create new option
            return $http({
                method: 'POST',
                data: {title: title},
                url: MyConst.serverUrl + '/app1/api/polls/' + pollId + '/options'
            });
        } // function postPoll(...)

        function putPoll(pollId, optId) { // vote for poll option
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
        } // function putPoll(...)

    } // function StoragePoll(...)

}());
