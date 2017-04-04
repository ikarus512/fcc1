/* file:  */
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



module.exports = function(res) {
  var txt = '';

  txt += '\n\n\n';
  txt += '--- ' + new Date().toISOString() + ' ---' + '\n';
  if (res) {
    txt += 'final redirect: ' + res.request.method+' '+res.request.url +'\n';
    txt += 'res.request.cookies: ' + res.request.cookies +'\n';

    // txt += 'res: ' + require('util').inspect(res,{depth:null});
    txt += 'res: ' + require('util').inspect(res,{depth:0}) +'\n';
    txt += 'res.header: ' + require('util').inspect(res.header,{depth:0}) +'\n';
    txt += 'res.body: ' + require('util').inspect(res.body,{depth:0}) +'\n';
    txt += 'res.request: ' + require('util').inspect(res.request,{depth:0}) +'\n';
    txt += 'res.request.header: ' + require('util').inspect(res.request.header,{depth:0}) +'\n';
  }

  fs.appendFile(LOG_FILE_NAME, txt);

};
