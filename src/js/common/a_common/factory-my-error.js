/* file: factory-my-error.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Factories
 * @desc common factories
 * @memberOf clients.Modules.a_common
 */
(function() {
    'use strict';

    angular
    .module('a_common')
    .factory('MyError', MyError);

    /**
     * @classdesc error log service
     * @class
     * @memberOf clients.Modules.a_common.Factories
     *
     * @example {@lang JavaScript}
     * ...
     * .catch(function(err) { MyError.alert(err); })
     */
    function MyError() {

        return {
            alert: myErrorAlert,
            log: myErrorLog
        };

        ////////////////////////////////////////

        /**
         * Alert function
         * @alias alert
         * @param {Object} res result object from $http promise
         * @static
         * @memberOf clients.Modules.a_common.Factories.MyError
         */
        function myErrorAlert(res) {
            if (res && res.data && res.data.message) {
                alert(res.data.message); // eslint-disable-line no-alert
                console.log(res.data.message);
            } else {
                console.log(res);
            }
        } // function myErrorAlert(...)

        /**
         * Log function
         * @alias log
         * @param {Object} res result object from $http promise
         * @static
         * @memberOf clients.Modules.a_common.Factories.MyError
         */
        function myErrorLog(res) {
            if (res && res.data && res.data.message) {
                console.log(res.data.message);
            } else {
                console.log(res);
            }
        } // function myErrorLog(...)

    } // function MyError(...)

}());
