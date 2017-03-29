'use strict';

var express = require('express'),
  app = express(),
  session = require('express-session'),
  path = require('path'),
  app_http = express(),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  mongooseConnect = require('./db/mongoose-connect.js'),
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
  https_options = {},
  isHeroku = require('./utils/is-heroku.js'),

  morganLogger = require('morgan'),
  rfs = require('rotating-file-stream'),
  logDir = path.join(__dirname, '../logs/'),

  myLogFile = path.join(logDir, 'my.log'),
  myHttpsLogger = require('./utils/my-https-logger.js'),

  passport = require('passport'),
  isLoggedIn = require('./config/passport')(passport);


////////////////////////////////////////////////////////////////
//  Settings
////////////////////////////////////////////////////////////////

if (!isHeroku()) {
  https_options = {
    cert : fs.readFileSync(__dirname+'/../_certificate/certificate.pem'),
    key  : fs.readFileSync(__dirname+'/../_certificate/key.pem')
  };
}

mongooseConnect();

app.set('port', (process.env.PORT || 5000));

app.enable('trust proxy'); // to get req.ip

app.set('view engine', 'pug');
app.set('views',__dirname+'/views');



////////////////////////////////////////////////////////////////
//  Middlewares
////////////////////////////////////////////////////////////////

// Logs before all middlewares
if (!isHeroku()) {
  fs.existsSync(logDir) || fs.mkdirSync(logDir);
  var logStream = rfs('access.log', { interval: '1d', path: logDir });
  app_http.use(morganLogger('combined', {stream: logStream, immeduate:true})); // log requests to file
  app.use     (morganLogger('combined', {stream: logStream, immeduate:true})); // log requests to file
}

// Redirect http to https
if (!isHeroku()) {
  app_http.all('*', function(req, res, next){
    res.redirect('https://'+req.hostname+':'+app.get('port'));
  });
} else {
  app.use(herokuSslRedirect());
}

// Static
app.use(express.static(path.join(__dirname, '../public')));


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "Yoursecret key7651894", resave: false, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Logs, detaled
if (!isHeroku()) {
  app.use(myHttpsLogger({file: myLogFile, immediate: true}));
}



////////////////////////////////////////////////////////////////
//  Routes
////////////////////////////////////////////////////////////////

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

if (!isHeroku()) {
  // Here if run on local host

  https.createServer(https_options, app).listen(app.get('port'), function () {
      console.log('Started https.');
  });

  http.createServer(app_http).listen(80, function () {
      console.log('Started http.');
  });

} else {
  // Here if run on Heroku

  app.listen(app.get('port'), function () {
    console.log('Heroku app listening on port '+app.get('port')+'.');
  });

}
