'use strict';

var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs'),
  PublicError = require('../utils/public-error.js');

mongoose.Promise = Promise;

var UserSchema = new Schema({
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
{ // options
  versionKey: false, // do not use __v property
  bufferCommands: false, // we'll do connection check manually
});

////////////////////////////////////////////////////////////////
//  virtuals
////////////////////////////////////////////////////////////////

UserSchema.virtual('type').get(function () {
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

UserSchema.virtual('name').get(function () {
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

// findOne with connection check
UserSchema.statics.findOneMy = function(filter) {

  return new Promise(function(resolve, reject) {

    if(!mongoose.connection.readyState) {
      throw new Error('No connection to users database.');
    }

    return resolve(mongoose.model('User', UserSchema).findOne(filter).exec());

  });

};

// createLocalUser
UserSchema.statics.createLocalUser = function(aUser) {

  return new Promise(function(resolve, reject) {

    if (!aUser.username) // username absent
      throw new PublicError('Please fill in username.');

    if (typeof(aUser.username)!=='string'
    || !aUser.username.match(/^(\w|\d|\-)+$/))
      throw new PublicError('Username can only contain -_alphanumeric characters.');

    if (typeof(aUser.password)!=='string'
    || typeof(aUser.password2)!=='string'
    || !aUser.password || !aUser.password2)
      throw new PublicError('Please fill in all fields as non-empty strings: ' +
        'username, password, password2.');

    if (aUser.password !== aUser.password2)
      throw new PublicError('Passwords do not match.');

    return resolve();
  })

  .then( function() {
    // first, check if user already exists.
    return UserModel().findOneMy({ 'local.username': aUser.username });
  })

  .then( function(foundUser) {
    if (foundUser) // if user exists
      throw new PublicError('User '+foundUser.local.username+' already exists.');

    // local user not found, we can try to create it

    // first, generate password hash
    return UserModel().generateHash(aUser.password);
  })

  .then( function(pwdHash) {
    // create new user with this password hash
    var newUser = new UserModel()();
    newUser.local.username = aUser.username;
    newUser.local.password = pwdHash;
    return newUser.save();
  })

};

// createUnauthorizedUser
UserSchema.statics.createUnauthorizedUser = function(ip) {

  return UserModel().findOneMy({'unauthorized.ip': ip})

  .then( function(user) {
    if (user) return user; // if found

    // if not found, create
    var user = new UserModel()();
    user.unauthorized.ip = ip;
    return user.save();
  })

};

// generating a hash
UserSchema.statics.generateHash = function(password) {

  var self = this;

  return new Promise(function(resolve, reject) {

    if (!self) {
      throw new Error('this undefined. User.generateHash() returns promise, but not result (rewrite program)!');
    }

    return resolve(myHashEncode(password));

  });

};

// checking if password is valid
UserSchema.methods.validatePassword = function(password, callback) {

  var self = this;

  return new Promise(function(resolve, reject) {

    if (!self) {
      throw new Error('this undefined. User.validatePassword() returns promise, but not result (rewrite program)!');
    }

    return resolve(myValidate(password, self.local.password));

  });

};

////////////////////////////////////////////////////////////////
//  Additional coding of bcrypt hash before store to DB.
//  Ideally, this algorithm should be hidden
//  (for example parameters can be moved to environment variables)
////////////////////////////////////////////////////////////////

var pwd_suffix = 'sfv';

function myHashEncode(str) {
  var
    roundsD = Math.ceil(Math.random()*3), // We'll use   8 <= rounds <= 8+3
    // h1 == [ '', '2a', rr, '$'+53 symbols of hash string ]
    h = bcrypt.hashSync(str+pwd_suffix, bcrypt.genSaltSync(8+roundsD)),
    h1 = h.split('$');

  if (h1[1] !== '2a') return h1; // No additional encoding on h1.


  // Here is what we have to encode:
  var hash1 = h1[3]; // 53 symbols of useful hash string.
  var hash2 = bcrypt.hashSync(str+pwd_suffix, bcrypt.genSaltSync(8+Math.ceil(Math.random()*3))).split('$')[3];
  var rounds = String.fromCharCode(40+roundsD+10*Math.ceil(Math.random()*6)); // ==integer*10+rounds
  // Now intermix symbols of hash1, hash2, roundsD so that we can later
  // decode hash1 and rounds.

  var i, res = rounds;
  for(var i=0; i<hash1.length; i++) {
    res += hash2[i] + hash1[i];
  }

  return res;
}

function myHashDecode(h) {
  if (h[0] == '$') return h; // No decoding needed.

  // Decode hash1 and rounds (drop hash2).
  var rounds = String(8 + (h.charCodeAt(0) % 10));
  rounds = (rounds.length<2) ? ('0'+rounds) : (rounds);

  var i, hash1='';
  for(var i=2; i<h.length; i+=2) hash1 += h[i];

  var res = '$2a$' + rounds + '$' + hash1;

  return res;
}

function myValidate(str, hash) {
  var res = bcrypt.compareSync(str+pwd_suffix, myHashDecode(hash));
  return res;
}

////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function UserModel() {
  return mongoose.model('User', UserSchema);
}

// module.exports = UserModel();
// module.exports = UserModel;
module.exports = mongoose.model('User', UserSchema);
