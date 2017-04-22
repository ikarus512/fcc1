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
  expressLess = require('express-less'),
  helmet = require('helmet'),
  herokuSslRedirect = require('./middleware/heroku-ssl-redirect.js'),
  greet = require('./utils/greet.js'),
  app1_voting    = require('./routes/app1.js'),
  app2_nightlife = require('./routes/app2.js'),
  app3_stock     = require('./routes/app3.js'),
  app4_books     = require('./routes/app4.js'),
  app5_pinter    = require('./routes/app5.js'),
  isHeroku = require('./utils/is-heroku.js'),
  isAdmin = require('./middleware/is-admin.js'),

  dbConnect = require('./config/db-connect.js'),
  dbInit = require('./config/db-init.js'),

  morganLogger = require('morgan'),
  rfs = require('rotating-file-stream'),
  logDir = path.join(__dirname, '../logs/'),

  myLogFile = path.join(logDir, 'my-request.log'),
  myRequestLogger = require('./middleware/my-request-logger.js'),

  passport = require('passport'),
  isLoggedIn = require('./config/passport')(passport);


////////////////////////////////////////////////////////////////
//  Settings
////////////////////////////////////////////////////////////////

app.set('port', (process.env.PORT || 5000));

app.enable('trust proxy'); // to get req.ip

app.set('view engine', 'pug');
app.set('views',__dirname+'/views');


dbConnect();

var expressStatusMonitor = ExpressStatusMonitor(require('./config/statmon-options.js'));

////////////////////////////////////////////////////////////////
//  Middlewares
////////////////////////////////////////////////////////////////

var tmpdir1;
tmpdir1 = path.join(__dirname, '../public' + '/img/app2tmp/');
fs.exists(tmpdir1, function(exists) { if (!exists) fs.mkdir(tmpdir1, function() {}); });
tmpdir1 = path.join(__dirname, '../public' + '/img/app4tmp/');
fs.exists(tmpdir1, function(exists) { if (!exists) fs.mkdir(tmpdir1, function() {}); });

// Logs before all middlewares
if (!isHeroku()) {
  // appHttp.use(helmet); // Node.js Security Tutorial

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  var logStream = rfs('access.log', { interval: '1d', path: logDir });
  appHttp.use(morganLogger('combined', {stream: logStream, immediate:true})); // log requests to file
  app.use    (morganLogger('combined', {stream: logStream, immediate:true})); // log requests to file

  appHttp.use(myRequestLogger({file: myLogFile, immediate: true, short: true}));
}

// Redirect http GET to https
if (!isHeroku()) {
  appHttp.get('*', function(req, res, next) {
    res.redirect('https://'+req.hostname+':'+app.get('port'));
  });

  appHttp.all('*', function (req, res) {
    res.status(400).json({message: 'Error: cannot '+req.method+' '+
      req.protocol+'://'+req.headers.host+req.originalUrl+'. Use https.'
    });
  });
} else {
  app.use(herokuSslRedirect());
}

app.use(expressStatusMonitor);

// Static
app.use(express.static(path.join(__dirname, '../public')));
// Less
app.use('/less', expressLess(__dirname + '/less', {
  // compress: true,
  // cache: true,
  // debug: true,
  debug: process.env.NODE_ENV !== 'production',
}));

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

// passport login-related routes
require('./routes/passport-login.js')(app, passport);

// / home route
require('./routes/home.js')(app, passport, isLoggedIn, greet);

// /settings route
require('./routes/settings.js')(app, passport, isLoggedIn, greet);

// applications-related routes
app.use('/app1', app1_voting);
app.use('/app2', app2_nightlife);
app.use('/app3', app3_stock);
app.use('/app4', app4_books);
app.use('/app5', app5_pinter);

// ALL * - json respond with error
app.all('*', function (req, res) {
  res.status(400).json({message: 'Error: cannot '+req.method+' '+req.originalUrl});
});





////////////////////////////////////////////////////////////////
//  Start server
////////////////////////////////////////////////////////////////

var server, serverHttp, boot, shutdown;

if (!isHeroku()) {
  // Here if run on local host

  server = https.createServer(require('./config/https-options.js'), app);
  serverHttp = http.createServer(appHttp);

  boot = function(done) {

    server.listen(app.get('port'), function (err) {
      console.log('NODE_ENV = '+process.env.NODE_ENV);

      if (err) throw err;
      else console.log('Started https.');

      serverHttp.listen(80, function (err) {
        if (err) throw err;
        else console.log('Started http.');

        dbInit( function() {

          console.log('DB initialized.');

          if (process.env.NODE_ENV !== 'production') {
            // Using socket.io during tests to:
            // 1) stop server in response to the npmStop signal,
            // 2) answer to client in response to npmServerRequest signal.
            var io = require('socket.io')(server);
            io.on('connection', function(socketServer) { // Here if new client connected
              socketServer.on('npmStop', function() {
                console.log('Server received npmStop.');
                process.exit(0); // Stop server
              });
              socketServer.on('npmServerRequest', function(data) {
                console.log('Server received request: ',data);
                socketServer.emit('new message', 'Server is ready.'); // Answer to client
              });
            });
          }

          if (done) return done();

        });

      });

    });

  };

  shutdown = function(done) {
    server.close( function() {
      // console.log('Stopped https.');
      serverHttp.close( function() {
        // console.log('Stopped http.');
        if (done) return done();
      });
    });
  };

} else {
  // Here if run on Heroku

  server = http.createServer(app);
  serverHttp = server;

  boot = function() {
    server.listen(app.get('port'), function () {
      dbInit( function() {
        console.log('Heroku app listening on port '+app.get('port')+'.');
      });
    });
  };

  shutdown = function() {
    server.close();
  };

}

require('./utils/app3/web-sockets.js')(server);



if (require.main === module) {
  boot();
} else {
  console.info('Running application as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
