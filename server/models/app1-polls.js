/* file: app1-polls.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Poll Model
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
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
});

module.exports = mongoose.model('Poll', Poll);
