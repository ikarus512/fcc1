/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("app3").controller("myApp3ControllerMain",["$scope","App3WebSocketService","MyConst","User","backendParams",function(a,t,e,n,o){function s(t){var e,n=a.chart1Data;t.data.x=t.data.x.map(function(a){return new Date(a)});for(e in t.data.stocks)t.data.stocks[e].values.forEach(function(a){a.x=new Date(a.x)});n.data.x.length>=r&&n.data.x.splice(0,i);for(e in n.data.stocks)n.data.stocks[e].values=n.data.stocks[e].values.filter(function(a){return a.x.getTime()>=n.data.x[0].getTime()}),n.data.stocks[e].values.length<2&&delete n.data.stocks[e];n.data.x=n.data.x.concat(t.data.x);for(e in t.data.stocks)n.data.stocks[e]||(n.data.stocks[e]={id:e,values:[]}),n.data.stocks[e].values=n.data.stocks[e].values.concat(t.data.stocks[e].values);a.chart1Data=n,a.$apply()}function c(e){e&&(a.ajaxLoadingSpinner++,t.subscribe(s).finally(function(){a.ajaxLoadingSpinner--}))}a.ajaxLoadingSpinner=0,e.webApp?(a.logintype=o.logintype&&"undefined"!==o.logintype?o.logintype:"",a.username=o.username&&"undefined"!==o.username?o.username:"",c(a.logintype)):n.check().then(function(){a.logintype=n.type,a.username=n.name,c(a.logintype)});var i=5,r=4*i;a.chart1Data={title:"Title",note:"Description",data:function(){var a,t=new Date,e={},n=["initialZeroLine"];for(e.x=[],a=0;a<r;a++)e.x.push(new Date(t.getTime()-.5*(r-a)*1e3));return e.stocks={},n.forEach(function(t){for(e.stocks[t]={},e.stocks[t].id=t,e.stocks[t].values=[],a=0;a<r;a++)e.stocks[t].values.push({x:new Date(e.x[a]),y:0})}),e}()},a.$on("$destroy",function(){t.close()}),a.addStockName=function(a){t.addStockName(a)},a.removeStockName=function(a){t.removeStockName(a)}}])}();