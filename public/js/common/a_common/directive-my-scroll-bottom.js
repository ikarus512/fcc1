/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";function o(o){return{restrict:"A",scope:{myScrollBottom:"="},link:function(t,c){t.$watchCollection("myScrollBottom",function(t){t&&o(function(){c.scrollTop(c[0].scrollHeight)},0)})}}}angular.module("a_common").directive("myScrollBottom",o),o.$inject=["$timeout"]}();