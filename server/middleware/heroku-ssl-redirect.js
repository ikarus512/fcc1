/* file: heroku-ssl-redirect.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Heroku Redirect to Use SSL/TLS
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * ALGORITHM DETAILS
 *  Force load with https on production environment
 *  https://devcenter.heroku.com/articles/http-routing#heroku-headers
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

module.exports = function() {
    return function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            if (req.method === 'GET') {
                res.redirect('https://' + req.hostname + req.originalUrl);
            } else {
                res.status(400).json({message: 'Error: cannot ' + req.method + ' ' +
                  req.protocol + '://' + req.headers.host + req.originalUrl + '. Use https.'
                });
            }
            return;
        } else {
            return next();
        }
    };
};
