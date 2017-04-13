/* file: my-request-logger.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Request Log
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var fs = require('fs');

module.exports = function(options) {

  var logStream = fs.createWriteStream(options.file, {flags: 'a'});
  var immediate = options.immediate;
  var short = options.short;

  function logWriteLn() {
    for(var i=0; i<arguments.length; i++) {
      var el = arguments[i];
      switch (typeof(el)) {
        case 'object':
          logStream.write(JSON.stringify(el));
          break;
        case 'undefined':
          logStream.write('undefined');
          break;
        case 'null':
          logStream.write('null');
          break;
        default:
          logStream.write(String(el));
          break;
      }
    }
    logStream.write('\n');
  }

  return function(req, res, next) {

    if (req.originalUrl.match(/^\/img/)) return next();
    if (req.originalUrl.match(/^\/lib/)) return next();
    if (req.originalUrl.match(/^\/css/)) return next();
    if (req.originalUrl.match(/^\/fonts/)) return next();
    if (req.originalUrl.match(/^\/js\/removeFacebookAppendedHash\.js/)) return next();



    if (!immediate) logStream.cork();

    logWriteLn();
    logWriteLn('--- ' + new Date().toISOString() + ' --- ' +
      req.method+' '+req.protocol+'://'+req.headers.host+req.originalUrl);

    if (!short) {
      logWriteLn('req.body=',req.body);
      logWriteLn('req.cookies=',req.cookies);
      logWriteLn('req.headers=',req.headers);
      logWriteLn('req.params=',req.params);
      logWriteLn('req.query=',req.query);
      logWriteLn('req.session=',req.session);
      logWriteLn('req.signedCookies=',req.signedCookies);
      logWriteLn('req.unauthorized_user=',req.unauthorized_user);
      logWriteLn('req.user=',req.user);
      logWriteLn('req=',require('util').inspect(req,{depth:0}));
    }

    if (!immediate) process.nextTick( function() { logStream.uncork(); } ); // flush stream

    return next();
  };
};
