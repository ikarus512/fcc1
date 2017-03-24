'use strict';

var User = require('../models/users');

module.exports = function(req, res, next) {

  if (req.isAuthenticated() || req.unauthorized_user) {
    return next();
  }

  User.findOne({'unauthorized.ip': req.ip}).exec()

  .then(function(user) {
    if (user) { // if found
      return user;
    } else { // if not found, create
      var user = new User();
      user.type = 'unauthorized';
      user.unauthorized.ip = req.ip;
      return user.save();
    }
  })

  // Save user to req.unauthorized_user
  .then(function(user){
    if (!req.unauthorized_user) {
      req.unauthorized_user = {};
      req.unauthorized_user._id = user._id;
      req.unauthorized_user.ip = req.ip;
    }
    return next();
  })

  // Ignore errors
  .catch(function(err){
    return next();
  });

};
