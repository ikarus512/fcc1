/*! Copyright 2017 ikarus512 https://github.com/ikarus512/fcc1.git */!function(){"use strict";angular.module("myapp").directive("keepFocus",["$timeout",function(e){return{restrict:"A",scope:{keepFocusVar:"@",keepFocusIndex:"@"},link:function(c,u,n){c.$watch("keepFocusIndex",function(n,o){c.keepFocusVar&&e(function(){u[0].focus()})})}}}])}();