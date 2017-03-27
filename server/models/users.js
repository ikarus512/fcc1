'use strict';

var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');
  // credential = require('credential');

mongoose.Promise = Promise;

var User = new Schema({
  // Virtual properties:
  // -type
  // -name

  // Social networks ids:
  facebook:     { id: String, username: String, displayName: String, },
  github:       { id: String, username: String, displayName: String, }, // publicRepos: Number
  twitter:      { id: String, username: String, displayName: String, },

  // Local login:
  local:        { username: String, password: String },

  // Not logged in (used in voting):
  unauthorized: { ip: String },
},
{ versionKey: false } // do not use __v property
);

////////////////////////////////////////////////////////////////
//  virtuals
////////////////////////////////////////////////////////////////

User.virtual('type').get(function () {
  var type = 'unknown';
  try {
    if(this.facebook.id)     type = 'facebook';
    if(this.github.id)       type = 'github';
    if(this.local.username)  type = 'local';
    if(this.twitter.id)      type = 'twitter';
    if(this.unauthorized.ip) type = 'unauthorized';
  } catch(err) {
  }

  return type;
});

User.virtual('name').get(function () {
  var name = 'unonimous';
  try {
    name = this[this.type].displayName;
    name = (name) ? name : this[this.type].username;
  } catch(err) {
  }

  return name;
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// generating a hash
// - no synchronous version available
// - callback version available, where callback is function(err,result_hash)
// - promise version available
User.statics.generateHash = function(password, callback) {
  if (callback) { // callback version
    bcrypt.hash(password, bcrypt.genSaltSync(8), null, callback);
  } else { // promise version
    return new Promise(function(resolve, reject) {
      resolve(bcrypt.hashSync(password, bcrypt.genSaltSync(8)));
    });
  }
};

// checking if password is valid
// - no synchronous version available
// - callback version available, where callback is function(err,res), res==true|false
// - promise version available
User.methods.validatePassword = function(password, callback) {
  if (callback) { // callback version
    bcrypt.compare(password, this.local.password, callback);
  } else { // promise version
    return new Promise(function(resolve, reject) {
      resolve(bcrypt.compareSync(password, this.local.password));
    });
  }
};

module.exports = mongoose.model('User', User);
