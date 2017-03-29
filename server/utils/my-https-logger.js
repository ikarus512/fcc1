'use strict';

var fs = require('fs');

module.exports = function(options) {

  var logStream = fs.createWriteStream(options.file, {flags: 'w'});
  var immediate = options.immediate;
  var short = options.short;

  function logWrite() {
    for(var i=0; i<arguments.length; i++) {
      var el = arguments[i];
      switch (typeof(el)) {
        case 'object':    logStream.write(JSON.stringify(el)); break;
        case 'undefined': logStream.write('undefined'); break
        default:          logStream.write(String(el)); break;
      }
    }
    logStream.write('\n');
  }

  return function(req, res, next) {
    // if(req.originalUrl.match(/^\/img/)) return next();
    // if(req.originalUrl.match(/^\/lib/)) return next();
    // if(req.originalUrl.match(/^\/css/)) return next();
    // if(req.originalUrl.match(/^\/fonts/)) return next();
    // if(req.originalUrl.match(/^\/js\/removeFacebookAppendedHash\.js/)) return next();

    if (!immediate) logStream.cork();

    if (short) {
      logWrite('--- '+req.method+' '+req.protocol+'://'+req.headers.host+req.originalUrl);
    } else {
      logWrite('\n\n\n');
      logWrite('----------------------------------------------------');
      // logWrite(req.method+' '+req.protocol+'://'+req.hostname+req.originalUrl);
      logWrite(req.method+' '+req.protocol+'://'+req.headers.host+req.originalUrl);
      // logWrite('headers.host=',req.headers.host);
      logWrite('session=',req.session);
      logWrite('cookies=',req.cookies);
      logWrite('signedCookies=',req.signedCookies);
      if(req.user) logWrite('user=',req.user.type,req.user.name,req.user);
      if(req.unauthorized_user) logWrite('unauthorized_user=',req.unauthorized_user);
      logWrite('params=',req.params);
      // logWrite('query=',req.query);
      logWrite('body=',req.body);
      // logWrite('headers=',req.headers);
    }

    if (!immediate) process.nextTick(function(){ logStream.uncork(); }); // flush stream

    return next();
  };
};
