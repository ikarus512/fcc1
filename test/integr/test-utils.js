'use strict';

process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Ignore 'self-signed certificate' error


var server = require('./../../server/index.js');


require('./hooks-main.js')(server.boot, server.shutdown);
require('./hooks-users.js')();
require('./hooks-app1.js')();
