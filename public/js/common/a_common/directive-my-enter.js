/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("a_common").directive("myEnter",function(){var n=13;return function(e,t,u){t.bind("keyup",function(t){t.keyCode===n&&e.$apply(u.myEnter)}),e.$on("$destroy",function(){t.unbind("keyup")})}})}();