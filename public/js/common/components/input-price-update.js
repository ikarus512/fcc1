/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("myapp").directive("inputPriceUpdate",["$timeout","MyConst",function(e,r){return{restrict:"E",scope:{placeholder:"=",name:"@",error:"=",ngModel:"=",myFocus:"=",myEnter:"&",sortIndex:"@"},templateUrl:r.urlPref+"js/common/components/input-price-update.html",link:function(r,i,n){r.$watch("sortIndex",function(n,o){r.focusVar&&e(function(){i.find("input").focus()})});["#priceRequiredA","#priceMinA","#priceNumberA"].forEach(function(e){i.find(e).popover({trigger:"manual"})}),r.$watch(function(){return r.error},function(e,r){r&&r.required||!e||!e.required?r&&r.min||!e||!e.min?r&&r.number||!e||!e.number?!e||e.required||e.min||e.number||(i.find("#priceRequiredA").popover("hide"),i.find("#priceMinA").popover("hide"),i.find("#priceNumberA").popover("hide")):(i.find("#priceRequiredA").popover("hide"),i.find("#priceMinA").popover("hide"),i.find("#priceNumberA").popover("show")):(i.find("#priceRequiredA").popover("hide"),i.find("#priceMinA").popover("show"),i.find("#priceNumberA").popover("hide")):(i.find("#priceRequiredA").popover("show"),i.find("#priceMinA").popover("hide"),i.find("#priceNumberA").popover("hide"))},!0)}}}])}();