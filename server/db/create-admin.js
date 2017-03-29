'use strict';

var
  ADMIN_PASSWORD = 'admin', // Unsecure to keep it here:) Just for education purpose.
  User = require('../models/users'),
  myErrorLog = require('../utils/my-error-log.js');

module.exports = function () {

  User.findOneMy({ 'local.username': 'admin' })

  .then(function(user) {
    if (user) { // if found
      throw new Error('Local admin user alredy exists.');
    }
    // if not found, create it
    // but first, generate password hash
    return User.generateHash(ADMIN_PASSWORD);
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
    myErrorLog(null, err);
    return;
  });

};
