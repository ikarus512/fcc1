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
    fs = require('fs'),
    isHeroku = require('./../utils/is-heroku.js'),
    path = require('path'),

    LOG_FILE_NAME = path.join(__dirname, '/../../logs/internal_errors.log');

module.exports = function(req, err, message) { // eslint-disable-line complexity

    if (isHeroku()) {
        if (message) {
            console.log('Message: ', message);
        }
        if (err) {
            console.log(err.name + ': ' + err.message);
        }
        return;
    }

    var txt = '';

    txt += '\n\n\n';
    txt += '--- ' + new Date().toISOString() + ' ---\n';
    if (message) {
        txt += 'Message: ' + message + '\n';
    }
    if (err) {
        txt += 'Error:\n';
        txt += 'name: ' + err.name + '\n';
        txt += 'message: ' + err.message + '\n';
        txt += 'stack:\n';
        txt += err.stack + '\n';
    }

    if (req) {
        txt += '\n';
        txt += req.method + ' ' + req.protocol + '://' + req.headers.host + req.originalUrl + '\n';
        if (req.user) {
            txt += 'user=' +
              req.user._id + ' ' +
              req.user.type + '/' +
              req.user.name + '\n';
        }
        if (req.unauthorizedUser) {
            txt += 'unauthorizedUser=' +
              req.unauthorizedUser._id + ' ' +
              req.unauthorizedUser.type + '/' +
              req.unauthorizedUser.ip + '\n';
        }
    }

    fs.appendFile(LOG_FILE_NAME, txt, function() {});

};
