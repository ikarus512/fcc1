/* file: directive-my-escape.js */
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
    .directive('myEscape', myEscape);

    /**
     * @classdesc attribute directive to call function on press <ESCAPE> key
     * @class
     * @memberOf clients.Modules.a_common.Directives
     *
     * @example {@lang xml}
     * <input my-escape='onPressEscape()'>
     * </input>
     */
    function myEscape() {

        var ESCAPE_KEY = 27;

        return linkFunction;

        ////////////////////////////////////////

        /**
         * Link function
         * @alias link
         * @static
         * @param {Object} scope
         * @param {Object} elem
         * @param {Object} attrs
         * @memberOf clients.Modules.a_common.Directives.myEscape
         */
        function linkFunction(scope, elem, attrs) {
            elem.bind('keyup', function (event) {
                if (event.keyCode === ESCAPE_KEY) {
                    scope.$apply(attrs.myEscape);
                }
            });

            scope.$on('$destroy', function () {
                elem.unbind('keyup');
            });
        } // function linkFunction(...)

    } // function myEscape(...)

}());
