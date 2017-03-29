'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
  title: String,
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  options: [{
    title: String,
    votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  }],
},
{ // options
  versionKey: false, // do not use __v property
  // bufferCommands: false,
});

module.exports = mongoose.model('Poll', Poll);
