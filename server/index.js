/* file: index.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Node Server
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var express = require('express'),
  app = express(),
  appHttp = express(),
  session = require('express-session'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  ExpressStatusMonitor = require('express-status-monitor'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  herokuSslRedirect = require('./utils/heroku-ssl-redirect.js'),
  greet = require('./utils/greet.js'),
  app1_voting    = require('./routes/app1.js'),
  app2_nightlife = require('./routes/app2.js'),
  app3_stock     = require('./routes/app3.js'),
  app4_books     = require('./routes/app4.js'),
  app5_pinter    = require('./routes/app5.js'),
  isHeroku = require('./utils/is-heroku.js'),
  isAdmin = require('./utils/is-admin.js'),

  morganLogger = require('morgan'),
  rfs = require('rotating-file-stream'),
  logDir = path.join(__dirname, '../logs/'),

  myLogFile = path.join(logDir, 'my-request.log'),
  myRequestLogger = require('./utils/my-request-logger.js'),

  passport = require('passport'),
  isLoggedIn = require('./config/passport')(passport);


////////////////////////////////////////////////////////////////
//  Settings
////////////////////////////////////////////////////////////////

app.set('port', (process.env.PORT || 5000));

app.enable('trust proxy'); // to get req.ip

app.set('view engine', 'pug');
app.set('views',__dirname+'/views');

require('./config/mongoose-connect.js')();

var expressStatusMonitor = ExpressStatusMonitor(require('./config/statmon-options.js'));

////////////////////////////////////////////////////////////////
//  Middlewares
////////////////////////////////////////////////////////////////

// Logs before all middlewares
if (!isHeroku()) {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  var logStream = rfs('access.log', { interval: '1d', path: logDir });
  appHttp.use(morganLogger('combined', {stream: logStream, immeduate:true})); // log requests to file
  app.use    (morganLogger('combined', {stream: logStream, immeduate:true})); // log requests to file

  appHttp.use(myRequestLogger({file: myLogFile, immediate: true, short: true}));
}

// Redirect http GET to https
if (!isHeroku()) {
  appHttp.get('*', function(req, res, next){
    res.redirect('https://'+req.hostname+':'+app.get('port'));
  });

  appHttp.all('*', function (req, res) {
    res.status(400).json({message: "Error: cannot "+req.method+" "+
      req.protocol+'://'+req.headers.host+req.originalUrl+". Use https."
    });
  });
} else {
  app.use(herokuSslRedirect());
}

app.use(expressStatusMonitor);

// Static
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(require('./config/session-options.js')(session)));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Logs, detaled
if (!isHeroku()) {
  app.use(myRequestLogger({file: myLogFile, immediate: true}));
}

////////////////////////////////////////////////////////////////
//  Routes
////////////////////////////////////////////////////////////////

// status monitor
app.get('/statmon', isAdmin, expressStatusMonitor.pageRoute);

// passport login-related routes, unprotected
require('./routes/passport-login.js')(app, passport);

// / route (home, unprotected)
require('./routes/home.js')(app, passport, isLoggedIn, greet);

// /settings route (protected)
require('./routes/settings.js')(app, passport, isLoggedIn, greet);

// applications-related routes
app.use('/app1', /*isLoggedIn,*/ app1_voting);
app.use('/app2', isLoggedIn, app2_nightlife);
app.use('/app3', isLoggedIn, app3_stock);
app.use('/app4', isLoggedIn, app4_books);
app.use('/app5', isLoggedIn, app5_pinter);

// ALL * - json respond with error
app.all('*', function (req, res) {
  res.status(400).json({message: "Error: cannot "+req.method+" "+req.originalUrl});
});





////////////////////////////////////////////////////////////////
//  Start server
////////////////////////////////////////////////////////////////

var server, server2, boot, shutdown;

if (!isHeroku()) {
  // Here if run on local host

  server = https.createServer(require('./config/https-options.js'), app);
  server2 = http.createServer(appHttp);

  boot = function(callback) {

    server.listen(app.get('port'), function (err) {
      if (err) console.log('Error starting https: '+err.message);
      else console.log('Started https.');

      server2.listen(80, function () {
        if (err) console.log('Error starting http: '+err.message);
        else console.log('Started http.');
        if (callback) return callback();
      });

    });
  };

  shutdown = function(callback) {
    server.close( function() {
      // console.log('Stopped https.');
      server2.close( function() {
        // console.log('Stopped http.');
        if (callback) return callback();
      });
    });
  };

} else {
  // Here if run on Heroku

  server = app;

  boot = function() {
    server.listen(app.get('port'), function () {
      console.log('Heroku app listening on port '+app.get('port')+'.');
    });
  };

  shutdown = function() {
    server.close();
  };

}



if (require.main === module) {
  boot();
} else {
  console.info('Running application as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
