'use strict';

var
  LOG_FILE_NAME = __dirname+'/../../logs/internal_errors.log',
  fs = require('fs');

module.exports = function(req, err) {

  var txt = '';

  txt += '\n\n\n';
  txt += '----------------------------------------------------' + '\n';
  txt += 'Internal error' + '\n';
  txt += 'date: ' + new Date() + '\n';
  txt += 'name: ' + err.name + '\n';
  txt += 'message: ' + err.message + '\n';
  txt += 'stack:' + '\n';
  txt += err.stack + '\n';

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

  try {
    fs.appendFile(LOG_FILE_NAME, txt); // fails on heroku
  } catch(err) {
  }

};
