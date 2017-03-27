'use strict';

var User = require('../models/users');

var admin_password = 'admin'; // Unsecure to keep it here:) Just for education purpose.

module.exports = function () {

  User.findOne({ 'local.username': 'admin' }).exec()

  .then(function(user) {
    if (user) { // if found
      throw new Error('Local admin user alredy exists.');
    }
    // if not found, create it
    // but first, generate password hash
    return User.generateHash(admin_password);
  })

  .then(function(pwd_hash){
    // create admin
    var user = new User();
    user.local.username = 'admin';
    user.local.password = pwd_hash;
    return user;
  })

  .then(function(user){
    return user.save();
  })

  .catch(function(err){
    // Do not treat as error.
    return;
  });

};
