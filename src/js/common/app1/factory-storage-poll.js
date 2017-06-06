/* file: factory-storage-poll.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

;( function() {
  'use strict';

  angular.module('myapp')

  .factory('StoragePoll', ['$http', 'MyConst', function ($http, MyConst) {
    return {
      get: function (poll_id) {
        return $http({
          method: 'GET',
          data: {},
          url: MyConst.serverUrl + '/app1/api/polls/'+poll_id
        });
      },

      delete: function (poll_id) { // delete poll
        return $http({
          method: 'DELETE',
          data: {},
          url: MyConst.serverUrl + '/app1/api/polls/'+poll_id
        });
      },

      post: function (poll_id,title) { // create new option
        return $http({
          method: 'POST',
          data: {title: title},
          url: MyConst.serverUrl + '/app1/api/polls/'+poll_id+'/options'
        });
      },

      put: function (poll_id, opt_id) { // vote for poll option
        return $http({
          method: 'PUT',
          data: {},
          url: MyConst.serverUrl + '/app1/api/polls/'+poll_id+'/options/'+opt_id+'/vote'
        });
      },

    };

  }]);

})();
