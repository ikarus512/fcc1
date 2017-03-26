'use strict';

var User = require('../models/users');

module.exports = function () {

  User.findOne({ 'local.username': 'admin' }).exec()

  .then(function(user) {
    if (user) { // if found
      throw new Error('Local admin user alredy exists.');
    } else { // if not found, create
      var user = new User();
      user.local.username = 'admin';
      user.local.password = user.generateHash('admin'); // Unsecure to keep it here:) Just for education purpose.
      return user;
    }
  })

  .then(function(user){
    return user.save()
  })

  .catch(function(err){
    // Do not treat as error.
    return;
  });

};
