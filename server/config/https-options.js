'use strict';

var
  fs = require('fs'),

  httpsOptions = {
    cert : fs.readFileSync(__dirname+'/../../_certificate/certificate.pem'),
    key  : fs.readFileSync(__dirname+'/../../_certificate/key.pem')
  };

module.exports = httpsOptions;
