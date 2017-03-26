'use strict';

var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schema = mongoose.Schema,
  bcrypt   = require('bcrypt-nodejs');

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
//  methods
////////////////////////////////////////////////////////////////

// generating a hash
User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
