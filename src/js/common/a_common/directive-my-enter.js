/* file: directive-my-enter.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace Directives
 * @desc common directives
 * @memberOf clients.Modules.a_common
 */
(function() {
    'use strict';

    angular
    .module('a_common')
    .directive('myEnter', myEnter);

    /**
     * @classdesc attribute directive to call function on press <ENTER> key
     * @class
     * @memberOf clients.Modules.a_common.Directives
     *
     * @example {@lang xml}
     * <input my-enter='onPressEnter()'>
     * </input>
     */
    function myEnter() {

        var ENTER_KEY = 13;

        return linkFunction;

        ////////////////////////////////////////

        /**
         * Link function
         * @alias link
         * @static
         * @param {Object} scope
         * @param {Object} elem
         * @param {Object} attrs
         * @memberOf clients.Modules.a_common.Directives.myEnter
         */
        function linkFunction(scope, elem, attrs) {
            elem.bind('keyup', function (event) {
                if (event.keyCode === ENTER_KEY) {
                    scope.$apply(attrs.myEnter);
                }
            });

            scope.$on('$destroy', function () {
                elem.unbind('keyup');
            });
        } // function linkFunction(...)

    } // function myEnter(...)

}());
