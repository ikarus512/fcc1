/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";function e(e,i){return{restrict:"E",scope:{placeholder:"=",name:"@",error:"=",ngModel:"=",myFocus:"=",myEnter:"&",sortIndex:"@"},templateUrl:i.urlPref+"js/common/a_components/input-price-update.html",link:function(i,r,n){i.$watch("sortIndex",function(n,o){i.focusVar&&e(function(){r.find("input").focus()})});["#priceRequiredA","#priceMinA","#priceNumberA"].forEach(function(e){r.find(e).popover({trigger:"manual"})}),i.$watch(function(){return i.error},function(e,i){i&&i.required||!e||!e.required?i&&i.min||!e||!e.min?i&&i.number||!e||!e.number?!e||e.required||e.min||e.number||(r.find("#priceRequiredA").popover("hide"),r.find("#priceMinA").popover("hide"),r.find("#priceNumberA").popover("hide")):(r.find("#priceRequiredA").popover("hide"),r.find("#priceMinA").popover("hide"),r.find("#priceNumberA").popover("show")):(r.find("#priceRequiredA").popover("hide"),r.find("#priceMinA").popover("show"),r.find("#priceNumberA").popover("hide")):(r.find("#priceRequiredA").popover("show"),r.find("#priceMinA").popover("hide"),r.find("#priceNumberA").popover("hide"))},!0)}}}angular.module("a_components").directive("inputPriceUpdate",e),e.$inject=["$timeout","MyConst"]}();