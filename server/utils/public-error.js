/* file: public-error.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Public Error 'Class'
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

function PublicError(message) {
  this.name = 'PublicError';
  this.message = message || 'PublicError';
  this.stack = (new Error()).stack;
}
PublicError.prototype = Object.create(Error.prototype);
PublicError.prototype.constructor = PublicError;

module.exports = PublicError;
