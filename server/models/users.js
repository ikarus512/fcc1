'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  username: String,
  type: String, // local/github/twitter/unauthorized
  local: {
    username: String,
    password: String
  },
  github: {
    id: String,
    displayName: String,
    username: String,
    publicRepos: Number
  },
  twitter: {
    id: String,
    displayName: String,
    username: String,
    publicRepos: Number
  },
  unauthorized: {
    ip: String
  },
},
{ versionKey: false } // do not use __v property
);

module.exports = mongoose.model('User', User);
