/* file: gulpfile.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: gulpfile.js
 * AUTHOR: ikarus512
 * CREATED: 2017/06/01
 *
 * MODIFICATION HISTORY
 *  2017/06/01, ikarus512. Initial version.
 *
 */

var
  browserSync   = require('browser-sync'),
  // cssLint       = require('gulp-csslint'),
  // cssMin        = require('gulp-clean-css'),
  changed       = require('gulp-changed'),
  // debug         = require('gulp-debug'), // .pipe(debug({verbose: true}))
  // es            = require('event-stream'), // For working with streams rather than temp dirs
  exec          = require('child_process').exec,
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  headerfooter  = require('gulp-headerfooter'),
  jshint        = require('gulp-jshint'),
  mkdirs        = require('mkdirs'),
  nodemon       = require('gulp-nodemon'),
  pug           = require('gulp-pug'),
  pugParams     = require('./src/views/pug-params.js').mobile,
  less          = require('gulp-less'),
  path          = require('path'),
  rename        = require('gulp-rename'),
  uglify        = require('gulp-uglify'),
  zzz;

var runCommand = function(command) {
  exec(command, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err !== null) {
      console.log('exec error: ' + err);
    }
  });
};


var MOBILE_SRC = './';
var MOBILE_DST = 'mobile/fcc1apps/www/';
var mobile_paths = {
  indexHtml: {
    src: MOBILE_SRC + 'src/views/mobile/_app_index.pug',
    rename_src: '_app_index',
    rename_dst: 'index',
    dest: MOBILE_DST,
  },
  favicon: {
    src: MOBILE_SRC + 'public/favicon.ico',
    dest: MOBILE_DST,
  },
  cordovaJs: {
    src: MOBILE_SRC + 'src/js/mobile/cordova.js',
    dest: MOBILE_DST,
  },
  // jsComponents: {
  //       MOBILE_SRC + 'src/js/common/components/input-price-update.html',
  // },
  js: {
    src : [
      MOBILE_SRC + 'src/js/**/*.{js,html}', // js and templates
    ],
    base: MOBILE_SRC + 'src/js/',
    dest: MOBILE_DST + 'js/',
  },
  copy: {
    src : [
      MOBILE_SRC + 'public/lib/**/*',
      MOBILE_SRC + 'public/css/**/*',
      MOBILE_SRC + 'public/fonts/**/*',
      MOBILE_SRC + 'public/img/**/*',
    ],
    base: MOBILE_SRC + 'public/',
    dest: MOBILE_DST,
  },
  views: {
    src: [
      MOBILE_SRC + 'src/views/common/home.pug',
      MOBILE_SRC + 'src/views/mobile/login.pug',
      MOBILE_SRC + 'src/views/common/app1_poll.pug',
      MOBILE_SRC + 'src/views/common/app1_polls.pug',
      MOBILE_SRC + 'src/views/common/app2_nightlife.pug',
      MOBILE_SRC + 'src/views/common/app3_stock.pug',
      MOBILE_SRC + 'src/views/common/app4_book.pug',
      MOBILE_SRC + 'src/views/common/app4_books.pug',
      MOBILE_SRC + 'src/views/common/app5_pinter.pug',
    ],
    dest: MOBILE_DST + 'views/',
  },
  less: {
    src: [ MOBILE_SRC + 'src/less/_dynapps.less',
           MOBILE_SRC + 'src/less/_mobile.less',],
    dest: MOBILE_DST + 'less/',
  },
};

gulp.task('mobile-app1-copy', function() {
  return gulp.src(mobile_paths.copy.src, {base: mobile_paths.copy.base})
  .pipe(gulp.dest(mobile_paths.copy.dest));
});

gulp.task('mobile-app1-js', function() {
  return gulp.src(mobile_paths.js.src, {base: mobile_paths.js.base})
  .pipe(gulp.dest(mobile_paths.js.dest));
});

gulp.task('mobile-app1-cordovaJs', function() {
  return gulp.src(mobile_paths.cordovaJs.src)
  .pipe(gulp.dest(mobile_paths.cordovaJs.dest));
});

gulp.task('mobile-app1-indexHtml', function() {
  return gulp.src(mobile_paths.indexHtml.src)
  .pipe(pug({locals: pugParams}))
  .pipe(rename( function(path) {
    if (path.basename === mobile_paths.indexHtml.rename_src) {
      path.basename = mobile_paths.indexHtml.rename_dst;
    }
  }))
  .pipe(gulp.dest(mobile_paths.indexHtml.dest));
});

gulp.task('mobile-app1-favicon', function() {
  return gulp.src(mobile_paths.favicon.src)
  .pipe(gulp.dest(mobile_paths.favicon.dest));
});

gulp.task('mobile-app1-views', function() {
  return gulp.src(mobile_paths.views.src)
  // .pipe(changed(mobile_paths.views.dest, {extension: '.html'}))
  .pipe(pug({locals: pugParams}))
  .pipe(gulp.dest(mobile_paths.views.dest));
});

gulp.task('mobile-app1-less', function() {
  return gulp.src(mobile_paths.less.src)
  // .pipe(changed(mobile_paths.less.dest, {extension: '.css'}))
  .pipe(less().on('error', gutil.log))
  .pipe(gulp.dest(mobile_paths.less.dest));
});

gulp.task('mobile-app1-prepare', [
  'mobile-app1-copy',
  'mobile-app1-js',
  'mobile-app1-indexHtml',
  'mobile-app1-favicon',
  'mobile-app1-cordovaJs',
  'mobile-app1-views',
  'mobile-app1-less',
      'devserver-public-html',
      'devserver-public-js',
]);


var WEB_SRC = './';
var WEB_DST = 'public/';
var devserver_paths = {
  jsHeader: '/*! Copyright 2017 ikarus512 https://github.com/ikarus512/fcc1.git */',
  publicJs: {
    src : [
      WEB_SRC + 'src/js/common/**/*.js',
      WEB_SRC + 'src/js/web/**/*.js',
    ],
    base: WEB_SRC + 'src/js/',
    dest: WEB_DST + 'js/',
  },
  publicHtml: {
    src : [
      WEB_SRC + 'src/js/common/**/*.html', // angular templates
    ],
    base: WEB_SRC + 'src/js/',
    dest: WEB_DST + 'js/',
  },
  serverJs: {
    src : WEB_SRC + 'server/**/*.js',
  },
};


gulp.task('devserver-public-html', function() { // jshint/minify/copy to public
  return gulp.src(devserver_paths.publicHtml.src, {base: devserver_paths.publicHtml.base})
  .pipe(gulp.dest(devserver_paths.publicHtml.dest))
  .on('error', gutil.log);
});

gulp.task('devserver-public-js', function() { // jshint/minify/copy to public
  return gulp.src(devserver_paths.publicJs.src, {base: devserver_paths.publicJs.base})
  .pipe(changed(devserver_paths.publicJs.dest))
  .pipe(jshint())
  .pipe(jshint.reporter(require('jshint-stylish')))
  // .pipe(uglify())
  // .pipe(headerfooter.header(devserver_paths.jsHeader))
  .pipe(gulp.dest(devserver_paths.publicJs.dest))
  .on('error', gutil.log);
});

gulp.task('devserver-server-js', function() { // Only syntax check
  return gulp.src(devserver_paths.serverJs.src)
  .pipe(changed(devserver_paths.serverJs.src))
  .pipe(jshint())
  .pipe(jshint.reporter(require('jshint-stylish')))
  .on('error', gutil.log);
});

gulp.task('mongo-start', function() {
  var paths = {
    dbDir: './_tmp/dbDir',
    dbLogs: './_tmp/dbLogs',
  };
  var command = ((process.platform === 'win32') ? 'start /MIN ' : '') +
    ' mongod' +
    ' --dbpath ' + process.cwd() + '/' + paths.dbDir + '/' +
    ' --logpath ' + process.cwd() + '/' + paths.dbLogs + '/mongo.log';

  mkdirs(paths.dbDir);
  mkdirs(paths.dbLogs);
  runCommand(command);
});

gulp.task('mongo-stop', function() {
  var command = 'mongo admin --eval "db.shutdownServer();"'
  runCommand(command);
});

gulp.task('devserver-build', [
  'devserver-public-html',
  'devserver-public-js',
  'devserver-server-js',
]);

gulp.task('devserver', ['mongo-start', 'devserver-build'], function(cb) {

  gulp.watch(devserver_paths.publicHtml.src, ['devserver-public-html']);
  gulp.watch(devserver_paths.publicJs.src, ['devserver-public-js']);

  return nodemon({
    script: 'server/index.js',            // The entry point
    watch: [ // The files to watch for changes in
      'server/**/*',
      // 'public/**/*',
      // 'src/js/**/*',
      'src/views/**/*',
      'src/less/**/*',
    ],
    // 'ignore': [ '.git' ],
    // 'verbose': true,
    // 'env': { 'NODE_ENV': 'development' },
    ext: 'js pug less',
    // tasks: ['devserver-build'],
    tasks: function(changedFiles) {
      var tasks = [];
      if (!changedFiles) return tasks;
      changedFiles.forEach( function(file) {
        console.log('changed file: ' + file);
        // if (file.match(/^src\/views/)) if (!~tasks.indexOf('lint')) tasks.push('lint');
        // if (path.extname(file) === '.js' && !~tasks.indexOf('lint')) tasks.push('lint');
        // if (path.extname(file) === '.css' && !~tasks.indexOf('cssmin')) tasks.push('cssmin');
      });
      return tasks;
    },
    // nodeArgs: ['--debug'],
    // legacyWatch: true,
    // options: '--delay 4', //'--delay 1500ms',
    delay: 500, // to prevent restarting twice
  })
  // .on('restart', ['devserver-build'])
  // .on('start',  function(a) { console.log('-start!',a); }) //['watch'])
  // .on('restart', function(a) { console.log('-restarted!',a); })
  ;
});

gulp.task('default', [
  'devserver-build',
  'mobile-app1-prepare',
]);
