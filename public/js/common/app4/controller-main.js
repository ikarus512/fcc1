/*! (C) 2017 https://github.com/ikarus512 */!function(){"use strict";angular.module("app4books").controller("myApp4Controller",["$scope","booksStorage","MyError","MyConst","User","backendParams",function(o,n,e,i,t,a){function r(){o.ajaxLoadingSpinner++,n.getBooks().then(function(n){o.books=n.data}).catch(function(o){e.alert(o)}).finally(function(){o.ajaxLoadingSpinner--})}o.ajaxLoadingSpinner=0,i.webApp?(o.logintype=a.logintype&&"undefined"!==a.logintype?a.logintype:"",o.username=a.username&&"undefined"!==a.username?a.username:""):(o.ajaxLoadingSpinner++,t.check().then(function(){o.logintype=t.type,o.username=t.name}).finally(function(){o.ajaxLoadingSpinner--})),o.urlPrefix=i.urlPrefix,o.serverUrl=i.serverUrl,o.mode="books",o.newBook=null,o.books=[],o.clearFile=function(){o.myAddBookForm.file.$setValidity("maxSize",!0),o.newBook.file=null},o.modeAddBook=function(n){o.newBook={title:"",createdBy:void 0,price:void 0,keywords:"",description:"",file:null},o.mode="addBook"},o.modeAddBookCancel=function(){o.newBook=null,o.mode="books"},o.newBookAdd=function(){o.newBook.title=o.newBook.title.trim(),o.newBook.keywords=o.newBook.keywords.trim(),o.newBook.description=o.newBook.description.trim(),o.newBook.title&&(o.ajaxLoadingSpinner++,n.postBook(o.newBook).then(function(n){r(),o.modeAddBookCancel()}).catch(function(o){e.alert(o)}).finally(function(){o.ajaxLoadingSpinner--}))},r()}])}();