/* file: my-error-log.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Error Log
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var
  LOG_FILE_NAME = __dirname+'/../../logs/internal_errors.log',
  fs = require('fs'),
  isHeroku = require('./../utils/is-heroku.js');

module.exports = function(req, err) {

  if (isHeroku()) {
    if (err) {
      console.log(err.name + ': ' + err.message);
    }
    return;
  }

  var txt = '';

  txt += '\n\n\n';
  txt += '--- ' + new Date().toISOString() + ' ---' + '\n';
  if (err) {
    txt += 'name: ' + err.name + '\n';
    txt += 'message: ' + err.message + '\n';
    txt += 'stack:' + '\n';
    txt += err.stack + '\n';
  }

  if (req) {
    txt += '\n';
    txt += req.method+' '+req.protocol+'://'+req.headers.host+req.originalUrl + '\n';
    if(req.user)
      txt += 'user=' +
        req.user._id + ' ' +
        req.user.type + '/' +
        req.user.name + '\n';
    if(req.unauthorized_user)
      txt += 'unauthorized_user=' +
        req.unauthorized_user._id + ' ' +
        req.unauthorized_user.type + '/' +
        req.unauthorized_user.ip + '\n';
  }

  fs.appendFile(LOG_FILE_NAME, txt);

};
