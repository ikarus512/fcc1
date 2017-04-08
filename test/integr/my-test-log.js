/* file: my-test-log.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: 
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var
  LOG_FILE_NAME = __dirname+'/../../logs/test.log',
  fs = require('fs');



module.exports = function(obj) {
  var txt = '';

  txt += '\n\n\n';
  txt += '--- ' + new Date().toISOString() + ' ---' + '\n';
  if (obj) {
    if (obj.err) {
      txt += 'err: ' + require('util').inspect(obj.err,{depth:1}) +'\n';
    }
    if (obj.req) {
      txt += 'req: ' + require('util').inspect(obj.req,{depth:1}) +'\n';
    }
    if (obj.res) {
      txt += 'res: ' + require('util').inspect(obj.res,{depth:1}) +'\n';

      txt += 'res.header: ' + require('util').inspect(obj.res.header,{depth:0}) +'\n';
      txt += 'res.body: ' + require('util').inspect(obj.res.body,{depth:0}) +'\n';
      txt += 'res.request: ' + require('util').inspect(obj.res.request,{depth:0}) +'\n';
      if (obj.res.request) {
        txt += 'res.request.header: ' + require('util').inspect(obj.res.request.header,{depth:0}) +'\n';
        txt += 'res final redirect: ' + obj.res.request.method+' '+obj.res.request.url +'\n';
        txt += 'res.request.cookies: ' + obj.res.request.cookies +'\n';
      }
    }
  }

  fs.appendFile(LOG_FILE_NAME, txt);

};
