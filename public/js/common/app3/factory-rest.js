/*! Copyright 2017 ikarus512 https://github.com/ikarus512/fcc1.git */!function(){"use strict";angular.module("myapp").factory("App3RestService",["$http","MyConst",function(t,e){return{getWsTicket:function(){return t({method:"GET",data:{},url:e.serverUrl+"/app3/api/get-ws-ticket"})}}}])}();