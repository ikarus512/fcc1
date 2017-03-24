'use strict';

var herokuAppUrl = 'https://ikarus512-fcc1.herokuapp.com/';

var express = require('express'),
  app = express(),
  session = require('express-session'),
  path = require('path'),
  app_http = express(),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  herokuSslRedirect = require('./utils/heroku-ssl-redirect.js'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  greet = require(path.join(__dirname, 'utils/greet.js')),
  app1_voting    = require('./routes/app1.js'),
  app2_nightlife = require('./routes/app2.js'),
  app3_stock     = require('./routes/app3.js'),
  app4_books     = require('./routes/app4.js'),
  app5_pinter    = require('./routes/app5.js'),
  https_options = {};

var passport = require('passport');
var isLoggedIn = require('./config/passport')(passport);


if (process.env.APP_URL !== herokuAppUrl) {
  https_options = {
    cert : fs.readFileSync(__dirname+'/config/cert/certificate.pem'),
    key  : fs.readFileSync(__dirname+'/config/cert/key.pem')
  };
} else {
  app.use(herokuSslRedirect());
}

mongoose.connect(process.env.APP_MONGODB_URI);
mongoose.Promise = Promise;

app.set('port', (process.env.PORT || 5000));

app.enable('trust proxy'); // to get req.ip

app.set('view engine', 'pug');
app.set('views',__dirname+'/views');

app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "Yoursecret key7651894", resave: false, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());




////////////////////////////////////////////////////////////////
//  Routes
////////////////////////////////////////////////////////////////

app.all('*', function (req, res, next) {
  console.log('\n\n\n');
  console.log('----------------------------------------------------');
  console.log(req.method+' '+req.protocol+'://'+req.hostname+req.originalUrl);
  console.log('session=',req.session);
  console.log('cookies=',req.cookies);
  console.log('signedCookies=',req.signedCookies);
  console.log('user=',req.user);
  console.log('unauthorized_user=',req.unauthorized_user);
  console.log('params=',req.params);
  // console.log('query=',req.query);
  console.log('body=',req.body);
  // console.log('headers=',req.headers);
  next();
});

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

if (process.env.APP_URL !== herokuAppUrl) {
  // Here if run on local host

  https.createServer(https_options, app).listen(app.get('port'), function () {
      console.log('Started https.');
  });

  // Redirect http to https
  app_http.all('*', function(req, res, next){
      res.redirect('https://'+req.hostname+':'+app.get('port'));
  });

  http.createServer(app_http).listen(80, function () {
      console.log('Started http.');
  });

} else {
  // Here if run on Heroku

  app.listen(app.get('port'), function () {
    console.log('App listening on port '+app.get('port')+'.');
  });

}
