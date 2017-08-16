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
    httpsOptions = null,
    path = require('path');

// istanbul ignore next
try {

    // Try to load .pem files in _certificate/ folder:

    httpsOptions = {
        cert : fs.readFileSync(path.join(__dirname, '/../../_certificate/certificate.pem')),
        key  : fs.readFileSync(path.join(__dirname, '/../../_certificate/key.pem'))
    };

} catch (err) {

    // Here if .pem files in _certificate/ folder absent.

    // Use test/cert/*.pem files instead.

    httpsOptions = {
        cert : fs.readFileSync(path.join(__dirname, '/../../test/cert/certificate.pem')),
        key  : fs.readFileSync(path.join(__dirname, '/../../test/cert/key.pem'))
    };

}

module.exports = httpsOptions;
