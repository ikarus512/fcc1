/* file: users.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: User Model
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *  2017/04/05, ikarus512. Added createAdmin() static.
 *
 */

/*jshint node: true*/
'use strict';

var
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    PublicError = require('./../utils/public-error.js'),
    myErrorLog = require('./../utils/my-error-log.js'),
    ADMIN_PASSWORD = require('./../config/admin-password.js');

mongoose.Promise = Promise;

var UserSchema = new Schema({
    // Virtual properties:
    // -type
    // -name

    // Social networks ids:
    facebook:     {id: String, username: String, displayName: String},
    github:       {id: String, username: String, displayName: String}, // publicRepos: Number
    twitter:      {id: String, username: String, displayName: String},

    // Local login:
    local:        {username: String, password: String},

    // Not logged in (used in voting):
    unauthorized: {ip: String},

    // Additional settings
    fullName:     String,
    city:         String,
    state:        String,
    country:      String

});

////////////////////////////////////////////////////////////////
//  virtuals
////////////////////////////////////////////////////////////////

UserSchema.virtual('type').get(function() { // eslint-disable-line complexity
    var type = 'unknown';
    try {
        if (this.facebook.id)     { type = 'facebook'; }
        if (this.github.id)       { type = 'github'; }
        if (this.local.username)  { type = 'local'; }
        if (this.twitter.id)      { type = 'twitter'; }
        if (this.unauthorized.ip) { type = 'unauthorized'; }
    } catch (err) {
    }

    return type;
});

UserSchema.virtual('name').get(function() {
    var name = 'unonimous';
    try {
        name = this[this.type].displayName;
        name = (name) ? name : this[this.type].username;
    } catch (err) {
    }

    return name;
});

////////////////////////////////////////////////////////////////
//  methods/statics
////////////////////////////////////////////////////////////////

// findOne with connection check
UserSchema.statics.findOneMy = function(filter) {

    return new Promise(function(resolve, reject) {

        if (!mongoose.connection.readyState) {
            throw new Error('No connection to users database.');
        }

        return resolve(mongoose.model('User', UserSchema).findOne(filter).exec());

    });

};

// createLocalUser
UserSchema.statics.createLocalUser = function(aUser) {

    return new Promise(function(resolve, reject) { // eslint-disable-line complexity

        if (!aUser.username) { // username absent
            throw new PublicError('Please fill in username.');
        }

        if (typeof(aUser.username) !== 'string' ||
            !aUser.username.match(/^(\w|\d|\-)+$/)
        )
        {
            throw new PublicError('Username can only contain -_alphanumeric characters.');
        }

        if (typeof(aUser.password) !== 'string' ||
          typeof(aUser.password2) !== 'string' ||
          !aUser.password || !aUser.password2
        )
        {
            throw new PublicError('Please fill in all fields as non-empty strings: ' +
              'username, password, password2.');
        }

        if (aUser.password !== aUser.password2) {
            throw new PublicError('Passwords do not match.');
        }

        return resolve();
    })

    .then(function() {
        // first, check if user already exists.
        return UserModel().findOneMy({'local.username': aUser.username});
    })

    .then(function(foundUser) {
        if (foundUser) { // if user exists
            throw new PublicError('User ' + foundUser.local.username + ' already exists.');
        }

        // local user not found, we can try to create it

        // first, generate password hash
        return UserModel().generateHash(aUser.password);
    })

    .then(function(pwdHash) {
        // create new user with this password hash
        var newUser = new UserModel()();
        newUser.local.username = aUser.username;
        newUser.local.password = pwdHash;
        return newUser.save();
    });

};

// createAdmin
UserSchema.statics.createAdmin = function(callback) {

    return UserModel().createLocalUser({
        username: 'admin',
        password: ADMIN_PASSWORD,
        password2: ADMIN_PASSWORD
    })

    .then(function() {
        if (callback) {
            if (typeof(callback) !== 'function') {
                throw Error('User.createAdmin() argument can only be callback function.');
            }
            return callback();
        }
        return;
    })

    .catch(function(err) {
        // no throw err, as we ignore errors here
        myErrorLog(null, err); // log error
        if (callback) { return callback(err); }
        return;
    });

};

// createUnauthorizedUser
UserSchema.statics.createUnauthorizedUser = function(ip) {

    return UserModel().findOneMy({'unauthorized.ip': ip})

    .then(function(foundUser) {
        if (foundUser) { return foundUser; } // if found

        // if not found, create
        var user = new UserModel()();
        user.unauthorized.ip = ip;
        return user.save();
    });

};

// generating a hash
UserSchema.statics.generateHash = function(password) {

    var self = this;

    return new Promise(function(resolve, reject) {

        if (!self) {
            throw new Error('this undefined. User.generateHash() returns promise, ' +
              'but not result (rewrite program)!');
        }

        return resolve(myHashEncode(password));

    });

};

// checking if password is valid
UserSchema.methods.validatePassword = function(password, callback) {

    var self = this;

    return new Promise(function(resolve, reject) {

        if (!self) {
            throw new Error('this undefined. User.validatePassword() returns promise, ' +
              'but not result (rewrite program)!');
        }

        return resolve(myValidate(password, self.local.password));

    });

};

// removeUser
UserSchema.statics.removeUser = function(id,uid) {

    return UserModel().findOne({_id:id}).exec()

    .then(function(user) {
        if (!user) { throw new PublicError('No user ' + id + '.'); }
        if (!user._id.equals(uid)) {
            throw new PublicError('User can remove only his own account.');
        }
        return UserModel().findOneAndRemove({_id:id}).exec();
    })

    .then(function() {
        return;
    });

};

// getSettings
UserSchema.statics.getSettings = function(id,uid) {

    return UserModel().findOne({_id:id}).exec()

    // Filter settings
    .then(function(user) {
        if (!user) { throw new PublicError('No user ' + id + '.'); }
        if (!user._id.equals(uid)) {
            throw new PublicError('User can get only his own settings.');
        }
        var settings = {};
        settings.fullName = user.fullName;
        settings.city = user.city;
        settings.state = user.state;
        settings.country = user.country;
        return settings;
    });

};

// updateSettings
UserSchema.statics.updateSettings = function(id,uid,settings) {

    return UserModel().findOne({_id:id}).exec()

    // Filter settings
    .then(function(user) {
        if (!user) { throw new PublicError('No user ' + id + '.'); }
        if (!user._id.equals(uid)) {
            throw new PublicError('User can update only his own settings.');
        }

        user.fullName = String(settings.fullName);
        user.city = String(settings.city);
        user.state = String(settings.state);
        user.country = String(settings.country);

        return user.save();
    })

    // Do not return user details
    .then(function() {
        return;
    });

};

////////////////////////////////////////////////////////////////
//  Additional coding of bcrypt hash before store to DB.
//  Ideally, this algorithm should be hidden
//  (for example parameters can be moved to environment variables)
////////////////////////////////////////////////////////////////

var PWD_SUFFIX = 'sfv';

function myHashEncode(str) {
    var
      roundsD = Math.ceil(Math.random() * 3), // We'll use   8 <= rounds <= 8+3
      // h1 == [ '', '2a', rr, '$'+53 symbols of hash string ]
      h = bcrypt.hashSync(str + PWD_SUFFIX, bcrypt.genSaltSync(8 + roundsD)),
      h1 = h.split('$');

    if (h1[1] !== '2a') { return h1; } // No additional encoding on h1.

    // Here is what we have to encode:
    var hash1 = h1[3]; // 53 symbols of useful hash string.
    var hash2 = bcrypt.hashSync(
      str + PWD_SUFFIX,
      bcrypt.genSaltSync(8 + Math.ceil(Math.random() * 3))
    ).split('$')[3];
    var rounds = String.fromCharCode(
      40 + roundsD + 10 * Math.ceil(Math.random() * 6) // ==integer*10+rounds
    );
    // Now intermix symbols of hash1, hash2, roundsD so that we can later
    // decode hash1 and rounds.

    var i,
      res = rounds;
    for (i = 0; i < hash1.length; i++) {
        res += hash2[i] + hash1[i];
    }

    return res;
}

function myHashDecode(h) {
    if (h[0] === '$') { return h; } // No decoding needed.

    // Decode hash1 and rounds (drop hash2).
    var rounds = String(8 + (h.charCodeAt(0) % 10));
    rounds = (rounds.length < 2) ? ('0' + rounds) : (rounds);

    var i,
      hash1 = '';
    for (i = 2; i < h.length; i += 2) { hash1 += h[i]; }

    var res = '$2a$' + rounds + '$' + hash1;

    return res;
}

function myValidate(str, hash) {
    var res = bcrypt.compareSync(str + PWD_SUFFIX, myHashDecode(hash));
    return res;
}

////////////////////////////////////////////////////////////////
//  exports
////////////////////////////////////////////////////////////////

function UserModel() {
    return mongoose.model('User', UserSchema);
}

module.exports = mongoose.model('User', UserSchema);
