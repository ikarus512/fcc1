/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("myapp").directive("ajaxLoadingSpinner",["$timeout","MyConst",function(n,a){return{restrict:"E",templateUrl:a.urlPref+"js/common/components/ajax-loading-spinner.html",scope:{ajaxLoadingVar:"@",addClass:"="},link:function(n,r,t){n.urlPref=a.urlPref,n.$watch("ajaxLoadingVar",function(n){n&&n>0?$(r).show():$(r).hide()})}}}])}();