/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("_common").directive("myEnter",function(){return function(n,e,t){e.bind("keyup",function(e){13===e.keyCode&&n.$apply(t.myEnter)}),n.$on("$destroy",function(){e.unbind("keyup")})}})}();