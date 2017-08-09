/* file: factory-storage-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @ngdoc factory
 * @memberof app1
 * @name StoragePoll
 * @description
 *   App1 poll storage
 */
(function() {
    'use strict';

    angular
    .module('myapp')
    .factory('StoragePoll', StoragePoll);

    function StoragePoll($http, MyConst) {

        return {
            get: getPoll,
            delete: deletePoll,
            post: postPoll,
            put: putPoll
        };

        ////////////////////////////////////////

        /**
         * Get poll data from server
         * @param {number} pollId Poll id
         * @memberof StoragePoll
         * @returns {Promise} promise with poll data
         */
        function getPoll(pollId) {
            return $http({
                method: 'GET',
                data: {},
                url: MyConst.serverUrl + '/app1/api/polls/' + pollId
            });
        } // function getPoll(...)

        /**
         * Delete poll
         * @param {number} pollId Poll id
         * @returns {Promise}
         * @memberof StoragePoll
         */
        function deletePoll(pollId) { // delete poll
            return $http({
                method: 'DELETE',
                data: {},
                url: MyConst.serverUrl + '/app1/api/polls/' + pollId
            });
        } // function deletePoll(...)

        /**
         * Create new option in the poll
         * @param {number} pollId Poll id
         * @param {String} title New option title
         * @returns {Promise} promise with updated poll data
         * @memberof StoragePoll
         */
        function postPoll(pollId, title) { // create new option
            return $http({
                method: 'POST',
                data: {title: title},
                url: MyConst.serverUrl + '/app1/api/polls/' + pollId + '/options'
            });
        } // function postPoll(...)

        /**
         * Votes for poll option
         * @param {number} pollId Poll id
         * @param {number} optId Id of the option to vote for
         * @returns {Promise} promise with updated poll data
         * @memberof StoragePoll
         */
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

    StoragePoll.$inject = ['$http', 'MyConst'];

}());
