'use strict';

function PublicError(message) {
  this.name = 'PublicError';
  this.message = message || 'PublicError';
  this.stack = (new Error()).stack;
}
PublicError.prototype = Object.create(Error.prototype);
PublicError.prototype.constructor = PublicError;

module.exports = PublicError;
