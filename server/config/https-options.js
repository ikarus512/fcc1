/* file: https-options.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: HTTPS Server Options
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

  httpsOptions = {
    cert : fs.readFileSync(__dirname+'/../../_certificate/certificate.pem'),
    key  : fs.readFileSync(__dirname+'/../../_certificate/key.pem')
  };

module.exports = httpsOptions;
