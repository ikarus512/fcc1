/* file: service-user.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('userService', ['$rootScope', function ($rootScope) {

    var service = {

      // model: {
      //   type: '',
      //   name: '',
      //   uid: '',
      // },

      SaveState: function (data) {
        // sessionStorage.userService = angular.toJson(service.model);
        if(typeof(localStorage) !== "undefined") {
          // console.log('save model=',service.model);
          // localStorage.setItem('model',JSON.stringify(service.model));
          console.log('save model=',data);
          localStorage.setItem('model',JSON.stringify(data));
        }
      },

      RestoreState: function () {
        if(typeof(localStorage) !== "undefined") {
          var it=localStorage.getItem('model');
          console.log('1 restored model=',it);
          //a.mydebug1(it);
          if (typeof(it)!=="undefined" && it!=="null" && it!==null) {
            // If object found in storage, return it.
            service.model = JSON.parse(it);
          }
        }
          console.log('2 restored model=',service.model);
        if (!service.model || !service.model.type) {
          service.model = {
            type: '',
            name: '',
            uid: '',
          };
        }
          console.log('3 restored model=',service.model);


        // service.model = angular.fromJson(sessionStorage.userService);
        // if (!service.model || !service.model.type) {
        //   service.model = {
        //     type: '',
        //     name: '',
        //     uid: '',
        //   };
        // }
      }
    };

    // $rootScope.$on("savestate", service.SaveState);
    // $rootScope.$on("restorestate", service.RestoreState);

    return service;
  }])

  .service('User', [
    'LoginFactory', 'userService',
    function(LoginFactory, userService) {

      var self = this;

userService.RestoreState();

      this.getType = function() { return userService.model.type; };
      this.getName = function() { return userService.model.name; };
      this.getUid  = function() { return userService.model.uid;  };

      this.loginLocal = function(username, password) {
        return LoginFactory.loginLocal(username, password)
        .then( function(res) {
          // userService.model.type = res.data.type;
          // userService.model.name = res.data.name;
          // userService.model.uid = res.data.uid;
userService.SaveState(res.data);
          console.log('a logged in as: ', res.data);
          return res;
        });
      };

    }

  ]); // .service('User', ...

})();
