/* file: factory-storage-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @ngdoc factory
 * @memberof app1
 * @name StoragePolls
 * @description
 *   App1 polls storage
 */
(function() {
    'use strict';

    angular
    .module('myapp')
    .factory('StoragePolls', StoragePolls);

    function StoragePolls($http, MyConst) {

        return {
            get: getPolls,
            post: postPoll
        };

        ////////////////////////////////////////

        /**
         * Get polls
         * @memberof StoragePolls
         * @returns {Promise} promise with polls
         */
        function getPolls() {
            return $http({
                method: 'GET',
                data:{},
                url: MyConst.serverUrl + '/app1/api/polls'
            });
        }

        /**
         * Create poll
         * @memberof StoragePolls
         * @param {Object} poll Poll to create (contains title)
         * @returns {Promise} promise with created poll
         */
        function postPoll(poll) {
            return $http({
                method: 'POST',
                data:poll,
                url: MyConst.serverUrl + '/app1/api/polls'
            });
        }

    } // function StoragePolls(...)

    StoragePolls.$inject = ['$http', 'MyConst'];

}());
