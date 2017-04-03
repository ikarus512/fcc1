'use strict';

// Create local users:
//    local.username=a, password=a
//    local.username=b, password=b
//    unauthorize.ip=x.x.x.y

module.exports = function() {

  var
    User = require('./../../server/models/users'),
    createAdmin = require('./../../server/models/create-admin.js');


  before( function () {

    return createAdmin()

    .then( function() {
      return User.createLocalUser({username: 'a', password: 'a', password2: 'a' })
    })

    .then( function() {
      return User.createLocalUser({username: 'b', password: 'b', password2: 'b' })
    })

    .then( function(createdUser) {
      return User.createUnauthorizedUser('x.x.x.y');
    })

    .catch( function(err) {
      throw err;
    });

  });

};
