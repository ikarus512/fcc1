/*! Copyright 2017 ikarus512 https://github.com/ikarus512/fcc1.git */!function(){"use strict";angular.module("myapp").controller("ctrSettings",["$scope","$window","RestService","MyError",function(t,n,e,i){function s(){t.uid&&e.getSettings(t.uid).then(function(n){t.settings=n.data,t.cancelChanges()}).catch(function(t){i.alert(t)})}t.settings={},t.newSettings={},s(),t.init=function(n,e){t.logintype="undefined"===n?"":n,t.uid="undefined"===e?"":e,s()},t.deleteUser=function(){confirm("Do you really want to delete the user?")&&e.deleteUser(t.uid).then(function(t){n.location.href="/"}).catch(function(t){i.alert(t)})},t.cancelChanges=function(){t.newSettings={},t.newSettings.fullName=t.settings.fullName,t.newSettings.city=t.settings.city,t.newSettings.state=t.settings.state,t.newSettings.country=t.settings.country},t.saveChanges=function(){t.newSettings.fullName=String(t.newSettings.fullName).trim(),t.newSettings.city=String(t.newSettings.city).trim(),t.newSettings.state=String(t.newSettings.state).trim(),t.newSettings.country=String(t.newSettings.country).trim(),e.postSettings(t.uid,t.newSettings).then(function(t){s()}).catch(function(t){i.alert(t)})}}])}();