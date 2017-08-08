/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("myapp").controller("myApp2ControllerMain",["$scope","cafeStorage","MyError","MyConst","User","backendParams",function(e,t,n,a,s,i){function o(e){if(e){var t=new Date;t.setMinutes(Math.floor(t.getMinutes()/u)*u),t.setSeconds(0),t.setMilliseconds(0),e.timeslots||(e.timeslots=[]),e.timeslots=e.timeslots.filter(function(e){return e.start>=t});var n,a,s=[];for(n=0;n<c;n++)(a=new Date(t)).setMinutes(a.getMinutes()+n*u),s.push(new Date(a));s.forEach(function(t){if(!e.timeslots.some(function(e){return e.start.getTime()===t.getTime()})){var n={start:new Date(t)};e.timeslots.push(n)}e.timeslots.forEach(function(e){var t=new Date(e.start);t.setMinutes(t.getMinutes()+1*u),e.strDate=e.start.getFullYear()+"/"+(e.start.getMonth()+1)+"/"+e.start.getDate(),e.strHoursStart=e.start.getHours(),e.strHoursEnd=t.getHours(),e.strMinutesStart=e.start.getMinutes(),e.strMinutesEnd=t.getMinutes(),e.strMinutesStart<10&&(e.strMinutesStart="0"+e.strMinutesStart),e.strMinutesEnd<10&&(e.strMinutesEnd="0"+e.strMinutesEnd),e.users||(e.users=[])})}),e.timeslots=e.timeslots.sort(function(e,t){return e.start>t.start})}}function r(){setTimeout(function(){var a;e.cafes.some(function(e){return e.selected&&(a=e._id),e.selected}),e.ajaxLoadingSpinnerSmall++,t.get(e.center,e.radius,e.zoom,e.selectedCafeId).finally(function(){e.ajaxLoadingSpinnerSmall--}).then(function(t){e.cafes=[];var n=t.data;n.some(function(e){return e._id===a})?n.forEach(function(e){e._id===a?e.show=e.selected=!0:e.show=e.selected=!1}):(e.selectedCafeId&&(e.selectedCafeId=void 0),n.forEach(function(e){e.show=!0,e.selected=!1})),n.forEach(function(e){e.timeslots||(e.timeslots=[]),e.timeslots.forEach(function(e){e.start&&(e.start=new Date(e.start))}),o(e)}),e.cafes=n}).catch(function(e){n.alert(e)})},0)}var c=4,u=30;if(e.ajaxLoadingSpinner=0,e.ajaxLoadingSpinnerSmall=0,e.cafes=[],e.selectedCafeId=void 0,e.zoom=16,e.center={lat:56.312956,lng:43.989955},e.radius=188.796,a.webApp){e.logintype=i.logintype&&"undefined"!==i.logintype?i.logintype:"",e.username=i.username&&"undefined"!==i.username?i.username:"";var l=i,d=l.lat&&"undefined"!==l.lat?l.lat:"",f=l.lng&&"undefined"!==l.lng?l.lng:"",m=l.zoom&&"undefined"!==l.zoom?l.zoom:"",p=l.radius&&"undefined"!==l.radius?l.radius:"";if(d=Number(d),f=Number(f),m=Number(m),p=Number(p),isFinite(d)&&(e.center.lat=d),isFinite(f)&&(e.center.lng=f),isFinite(m)&&(e.zoom=m),isFinite(p)&&(e.radius=p),l.selectedCafeId&&"undefined"!==l.selectedCafeId)var g=setInterval(function(){e.mapInit&&(e.listSelectedCafe(l.selectedCafeId),clearInterval(g))},100)}else e.ajaxLoadingSpinner++,s.check().then(function(){e.logintype=s.type,e.username=s.name}).finally(function(){e.ajaxLoadingSpinner--});e.onMapInit=function(){e.mapInit=!0},e.onPlan=function(a,s){e.username&&(e.ajaxLoadingSpinner++,t.planCafeTimeslot(a._id,s.start).finally(function(){e.ajaxLoadingSpinner--}).then(function(t){s.planned=!0,s.users.push(e.username)}).catch(function(e){n.alert(e)}))},e.onUnplan=function(a,s){e.username&&(e.ajaxLoadingSpinner++,t.unplanCafeTimeslot(a._id,s.start).finally(function(){e.ajaxLoadingSpinner--}).then(function(t){s.planned=!1,s.users.splice(s.users.indexOf(e.username),1)}).catch(function(e){n.alert(e)}))},e.cafesUnselect=function(){e.cafes.forEach(function(e){e.show=!0,e.selected=!1}),e.selectedCafeId&&(e.selectedCafeId=void 0)},e.listSelectedCafe=function(t){e.selectedCafeId!==t&&(e.selectedCafeId=t),e.cafeSelect(t)},e.mapSelectedCafe=function(t){e.selectedCafeId!==t&&(e.selectedCafeId=t),e.cafeSelect(t)},e.cafeSelect=function(n){var a;e.cafes.forEach(function(e){e.show=e.selected=!1,e._id===n&&(a=e,e.show=e.selected=!0)}),e.ajaxLoadingSpinnerSmall++,t.updateSessionState(e.location,e.radius,e.zoom,e.selectedCafeId).finally(function(){e.ajaxLoadingSpinnerSmall--}),o(a)},e.mapMoved=function(t){t.newCenter&&(e.center=t.newCenter),e.zoom=t.newZoom,e.radius=t.newRadius,r()},r()}])}();