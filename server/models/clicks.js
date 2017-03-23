'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Click = new Schema(
  { clicks: Number },
  { versionKey: false } // do not use __v property to schema
);

module.exports = mongoose.model('Click', Click); // 'Click'-->'clicks' collection
