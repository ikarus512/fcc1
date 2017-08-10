/* file: factory-my-error.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    angular.module('_common')

    .factory('MyError', function MyError() {

        return {

            alert: function myErrorAlert(res) {
                if (res && res.data && res.data.message) {
                    alert(res.data.message); // eslint-disable-line no-alert
                    console.log(res.data.message);
                } else {
                    console.log(res);
                }
            }, // alert: function myErrorAlert(...)

            log: function myErrorLog(res) {
                if (res && res.data && res.data.message) {
                    console.log(res.data.message);
                } else {
                    console.log(res);
                }
            } // log: function myErrorLog(...)

        };

    }); // .factory('MyError', ...

}());
