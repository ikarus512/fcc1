/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("settings").factory("RestService",["$http",function(t){return{getSettings:function(e){return t({method:"GET",data:{},url:"/settings/api/users/"+e})},deleteUser:function(e){return t({method:"DELETE",data:{},url:"/settings/api/users/"+e})},postSettings:function(e,n){return t({method:"POST",data:n,url:"/settings/api/users/"+e})}}}])}();