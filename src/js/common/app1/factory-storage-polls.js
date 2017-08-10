/* file: factory-storage-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Factories
 * @desc app1polls factories
 * @memberOf clients.Modules.app1polls
 */
(function() {
    'use strict';

    angular
    .module('app1polls')
    .factory('StoragePolls', StoragePolls);

    /**
     * @classdesc Polls storage factory
     * @class
     * @param {Object} $http
     * @param {Object} MyConst
     * @memberOf clients.Modules.app1polls.Factories
     */
    function StoragePolls($http, MyConst) {

        return {
            get: getPolls,
            post: postPoll
        };

        ////////////////////////////////////////

        /**
         * Get polls
         * @alias get
         * @returns {Promise} promise with polls
         * @static
         * @memberOf clients.Modules.app1polls.Factories.StoragePolls
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
         * @alias post
         * @param {Object} poll Poll to create (contains title)
         * @returns {Promise} promise with created poll
         * @static
         * @memberOf clients.Modules.app1polls.Factories.StoragePolls
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
