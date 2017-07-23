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
  APPCONST = require('./config/constants.js'),
  app = express(),
  appHttp = express(),
  session = require('express-session'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  Promise = require('bluebird'),
  ExpressStatusMonitor = require('express-status-monitor'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  expressLess = require('express-less'),
  herokuSslRedirect = require('./middleware/heroku-ssl-redirect.js'),
  greet = require('./utils/greet.js'),
  app1Voting    = require('./routes/app1.js'),
  app2Nightlife = require('./routes/app2.js'),
  app3Stock     = require('./routes/app3.js'),
  app4Books     = require('./routes/app4.js'),
  app5Pinter    = require('./routes/app5.js'),
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

app.set('port', APPCONST.env.PORT);

app.enable('trust proxy'); // to get req.ip
if (!isHeroku()) { appHttp.enable('trust proxy'); }

app.set('view engine', 'pug');
app.set('views',__dirname + './../src/views/common');

dbConnect();

var expressStatusMonitor = ExpressStatusMonitor(require('./config/statmon-options.js'));

////////////////////////////////////////////////////////////////
//  Middlewares
////////////////////////////////////////////////////////////////

var tmpdir1;
tmpdir1 = path.join(__dirname, '../public' + '/img/app2tmp/');
fs.exists(tmpdir1, function(exists) { if (!exists) { fs.mkdir(tmpdir1, function() {}); } });
tmpdir1 = path.join(__dirname, '../public' + '/img/app4tmp/');
fs.exists(tmpdir1, function(exists) { if (!exists) { fs.mkdir(tmpdir1, function() {}); } });

// Logs before all middlewares
if (!isHeroku()) {
    if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }
    var logStream = rfs('access.log', {interval: '1d', path: logDir});

    // log requests to file
    appHttp.use(morganLogger('combined', {stream: logStream, immediate:true}));
    app.use    (morganLogger('combined', {stream: logStream, immediate:true}));

    appHttp.use(myRequestLogger({file: myLogFile, immediate: true
        // , short: true
    }));
}

// security headers
require('./middleware/security-headers-common.js')(app);

// Redirect http GET to https
if (!isHeroku()) {

    // security headers
    require('./middleware/security-headers-http.js')(appHttp);

    appHttp.get('*', function(req, res, next) {
        res.redirect('https://' + req.hostname + ':' + app.get('port'));
    });

    appHttp.all('*', function (req, res) {
        res.status(400).json({message: 'Error: cannot ' + req.method + ' ' +
          req.protocol + '://' + req.headers.host + req.originalUrl + '. Use https.'
        });
    });

} else {

    app.use(herokuSslRedirect());

}

app.use(expressStatusMonitor);

// Static
function depStatic(url, localFilePath) {
    app.get(url, function(req, res) {
        var
            basename = path.basename(url),
            fullLocalFilePath = path.join(
                __dirname, '../node_modules', localFilePath, basename);
        res.sendFile(fullLocalFilePath);
    });
}
// angular
depStatic('/lib/angular.min.js',                      'angular/');
depStatic('/lib/angular.min.js.map',                  'angular/');
depStatic('/lib/angular-animate.min.js',              'angular-animate/');
depStatic('/lib/angular-animate.min.js.map',          'angular-animate/');
depStatic('/lib/angular-messages.min.js',             'angular-messages/');
depStatic('/lib/angular-messages.min.js.map',         'angular-messages/');
depStatic('/lib/angular-route.min.js',                'angular-route/');
depStatic('/lib/angular-route.min.js.map',            'angular-route/');
// bootstrap
depStatic('/lib/bootstrap.min.css',                   'bootstrap/dist/css/');
depStatic('/lib/bootstrap.min.js',                    'bootstrap/dist/js/');
depStatic('/fonts/glyphicons-halflings-regular.eot',  'bootstrap/dist/fonts/');
depStatic('/fonts/glyphicons-halflings-regular.svg',  'bootstrap/dist/fonts/');
depStatic('/fonts/glyphicons-halflings-regular.ttf',  'bootstrap/dist/fonts/');
depStatic('/fonts/glyphicons-halflings-regular.woff', 'bootstrap/dist/fonts/');
depStatic('/fonts/glyphicons-halflings-regular.woff2','bootstrap/dist/fonts/');
// chart.js
depStatic('/lib/Chart.bundle.min.js',                 'chart.js/dist/');
depStatic('/lib/angular-chart.min.js',                'angular-chart.js/dist/');
depStatic('/lib/angular-chart.min.js.map',            'angular-chart.js/dist/');
depStatic('/lib/tc-angular-chartjs.min.js',           'tc-angular-chartjs/dist/');
// d3
depStatic('/lib/d3.min.js',                           'd3/build/');
// font-awesome
depStatic('/lib/font-awesome.min.css',                'font-awesome/css/');
depStatic('/fonts/FontAwesome.otf',                   'font-awesome/fonts/');
depStatic('/fonts/fontawesome-webfont.eot',           'font-awesome/fonts/');
depStatic('/fonts/fontawesome-webfont.svg',           'font-awesome/fonts/');
depStatic('/fonts/fontawesome-webfont.ttf',           'font-awesome/fonts/');
depStatic('/fonts/fontawesome-webfont.woff',          'font-awesome/fonts/');
depStatic('/fonts/fontawesome-webfont.woff2',         'font-awesome/fonts/');
// jquery
depStatic('/lib/jquery.min.js',                       'jquery/dist/');
// leaflet
depStatic('/lib/leaflet/leaflet.js',                  'leaflet/dist/');
depStatic('/lib/leaflet/leaflet.css',                 'leaflet/dist/');
depStatic('/lib/leaflet/images/layers.png',           'leaflet/dist/images/');
depStatic('/lib/leaflet/images/layers-2x.png',        'leaflet/dist/images/');
depStatic('/lib/leaflet/images/marker-icon.png',      'leaflet/dist/images/');
depStatic('/lib/leaflet/images/marker-icon-2x.png',   'leaflet/dist/images/');
depStatic('/lib/leaflet/images/marker-shadow.png',    'leaflet/dist/images/');
// ng-file-upload
depStatic('/lib/ng-file-upload-all.min.js',           'ng-file-upload/dist/');
// Other static files
app.use(express.static(path.join(__dirname, '../public')));
// Less
app.use('/less', expressLess(__dirname + './../src/less', {
    // compress: true,
    // cache: true,
    // debug: true,
    debug: APPCONST.env.NODE_ENV !== 'production',
}));

app.use(bodyParser.urlencoded({extended: true}));
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

var rateLimitAll = require('./middleware/security-rate-limit-all.js');
app.use(rateLimitAll);

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
app.use('/app1', app1Voting);
app.use('/app2', app2Nightlife);
app.use('/app3', app3Stock);
app.use('/app4', app4Books);
app.use('/app5', app5Pinter);

// ALL * - json respond with error
app.all('*', function (req, res) {
    res.status(400).json({message: 'Error: cannot ' + req.method + ' ' + req.originalUrl});
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

        var promises = [];

        promises.push(new Promise(function(resolve, reject) {
            console.log('Trying to start https on port ' + app.get('port'));
            server.listen(app.get('port'), function (err) {
                console.log('NODE_ENV = ' + APPCONST.env.NODE_ENV);
                if (err) { throw err; }
                console.log('Started https.');
                return resolve();
            });
        }));

        promises.push(new Promise(function(resolve, reject) {
            console.log('Trying to start http on port ' + APPCONST.env.PORT_HTTP);
            if (APPCONST.env.PORT_HTTP === 80) {
                console.log('Port 80 not accessible on travis-ci.org Linux wihout sudo.');
            }
            serverHttp.listen(APPCONST.env.PORT_HTTP, function (err) {
                if (err) { throw err; }
                console.log('Started http.');
                return resolve();
            });
        }));

        if (APPCONST.env.NODE_ENV.match(/^test/)) {
            // Here if test env.
            // Wait for DB initialization:
            promises.push(dbInit(function() { console.log('DB initialized.'); }));
        }

        Promise.all(promises)
        .then(function() {
            console.log('Server ready.');

            if (!APPCONST.env.NODE_ENV.match(/^test/)) {
                // Here if not test env (production).
                // Do not wait for DB initialization.
                dbInit(function() { console.log('DB initialized.'); });
            }

            // Start socket.io server
            require('./modules/socket-io-server.js')(server);

            // Start webSocket server
            require('./modules/web-socket-init.js')({server:server});

            if (done) { return done(); }
            return;
        });

    };

    shutdown = function(done) {
        // // The following hangs on travis-ci e2e protractor:
        // server.close(function() {
        //     console.log('Stopped https.');
        //     serverHttp.close(function() {
        //         console.log('Stopped http.');
        //         if (done) { return done(); }
        //     });
        // });

        // Ok on travis-ci:
        server.close(function() {
            console.log('Stopped https.');
        });
        serverHttp.close(function() {
            console.log('Stopped http.');
        });
        if (done) { return done(); }

    };

} else {
    // Here if run on Heroku

    server = http.createServer(app);
    serverHttp = server;

    boot = function() {
        server.listen(app.get('port'), function () {
            console.log('Heroku app listening on port ' + app.get('port') + '.');
        });
        dbInit(function() {});
        require('./modules/web-socket-init.js')({server:server});
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
