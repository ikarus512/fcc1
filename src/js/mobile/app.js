/* file: app.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp', [
    'chart.js',
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngFileUpload'
  ]);

})();


// var a = a || {};
// jQuery.noConflict();
// a.os="";
// a.cordova=false;
// if(window.navigator.appVersion.search(/Android/i)>=0) {
//     a.os="And";
// }
// if(window.navigator.appVersion.search(/Windows/i)>=0) {
//     a.os="Win";
// }
// if(typeof(cordova)==="undefined" || typeof(cordova.version)==="undefined") {
//     a.cordova=false;
//     // a.alert=function(){window.alert(arguments[0],arguments[1],arguments[2],arguments[3]);};
//     // a.exit =function(){};
//     // a.previousPage=function(){window.history.back();};
// } else {
//     a.cordova=true;
//     // a.alert=function(){navigator.notification.alert(arguments[0],arguments[1],arguments[2],arguments[3]);};
//     // a.exit =function(){navigator.app.exitApp();};
//     // a.previousPage=function(){navigator.app.backHistory();};
// }

// if(a.cordova) {
//   document.addEventListener("deviceready",function(){
//     jQuery(document).ready(function() {
//       // a.onReady();
//       //a.goPage("index.html#startpage");
//     });
//   }, false);
// }
