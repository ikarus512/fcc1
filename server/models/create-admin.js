'use strict';

var
  ADMIN_PASSWORD,
  User = require('../models/users'),
  myErrorLog = require('../utils/my-error-log.js');

if (process.env.NODE_ENV === 'production') {
  ADMIN_PASSWORD = 'admin'; // Unsecure to keep it here:) But ok for education purposes.
} else { // developement/test environment
  ADMIN_PASSWORD = '1234';
}


module.exports = function (callback) {

  return User.createLocalUser({
    username: 'admin',
    password: ADMIN_PASSWORD,
    password2: ADMIN_PASSWORD,
  })

  .then(function(err){
    if (callback) return callback();
    return;
  })

  .catch(function(err){
    // no throw err, as we ignore errors here
    myErrorLog(null, err); // log error
    if (callback) return callback(err);
    return;
  });

};
