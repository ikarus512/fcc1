'use strict';

var
  LOG_FILE_NAME = __dirname+'/../../logs/test.log',
  fs = require('fs');



module.exports = function(res) {
  var txt = '';

  txt += '\n\n\n';
  txt += '--- ' + new Date().toISOString() + ' ---' + '\n';
  txt += 'final redirect: ' + res.request.method+' '+res.request.url +'\n';
  txt += 'res.request.cookies: ' + res.request.cookies +'\n';

  // txt += 'res: ' + require('util').inspect(res,{depth:null});
  txt += 'res: ' + require('util').inspect(res,{depth:0}) +'\n';
  txt += 'res.header: ' + require('util').inspect(res.header,{depth:0}) +'\n';
  txt += 'res.body: ' + require('util').inspect(res.body,{depth:0}) +'\n';
  txt += 'res.request: ' + require('util').inspect(res.request,{depth:0}) +'\n';
  txt += 'res.request.header: ' + require('util').inspect(res.request.header,{depth:0}) +'\n';

  fs.appendFile(LOG_FILE_NAME, txt);

};
