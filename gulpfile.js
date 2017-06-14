var
  browserSync   = require('browser-sync'),
//cssLint       = require('gulp-csslint'),
//cssMin        = require('gulp-clean-css'),
//changed       = require('gulp-changed'),
  debug         = require('gulp-debug'), // .pipe(debug({verbose: true}))
//es            = require('event-stream'), // For working with streams rather than temp dirs
//footer        = require('gulp-footer'),
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  jshint        = require('gulp-jshint'),
  nodemon       = require('gulp-nodemon'),
  pug           = require('gulp-pug'),
  pugParams     = require('./src/views/pug-params.js').mobile,
  less          = require('gulp-less'),
  path          = require('path'),
  rename        = require('gulp-rename'),
  uglify        = require('gulp-uglify'),
  zzz;


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
      MOBILE_SRC + 'public/lib/*',
      MOBILE_SRC + 'public/css/*',
      MOBILE_SRC + 'public/fonts/*',
      MOBILE_SRC + 'public/img/*',
    ],
    base: MOBILE_SRC + 'public/',
    dest: MOBILE_DST,
  },
  views: {
    src: [
      MOBILE_SRC + 'src/views/mobile/home.pug',
      MOBILE_SRC + 'src/views/mobile/autologin.pug',
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
    src: MOBILE_SRC + 'src/less/_dynapps.less',
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
  .pipe(pug({locals: pugParams}))
  .pipe(gulp.dest(mobile_paths.views.dest));
});

gulp.task('mobile-app1-less', function() {
  return gulp.src(mobile_paths.less.src)
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
  'mobile-app1-less'
]);


var WEB_SRC = './';
var WEB_DST = 'public/';
var web_paths = {
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


gulp.task('web-public-html', function() { // jshint/minify/copy to public
  return gulp.src(web_paths.publicHtml.src, {base: web_paths.publicHtml.base})
  .pipe(gulp.dest(web_paths.publicHtml.dest))
  .on('error', gutil.log);
});

gulp.task('web-public-js', function() { // jshint/minify/copy to public
  return gulp.src(web_paths.publicJs.src, {base: web_paths.publicJs.base})
  .pipe(jshint())
  .pipe(jshint.reporter(require('jshint-stylish')))
  // .pipe(uglify())
//.pipe(footer(CONFIG.FOOTER_TEXT))        // Add footer to script
  .pipe(gulp.dest(web_paths.publicJs.dest))
  .on('error', gutil.log);
});

gulp.task('web-server-js', function() { // Only syntax check
  return gulp.src(web_paths.serverJs.src)
  .pipe(jshint())
  .pipe(jshint.reporter(require('jshint-stylish')))
  .on('error', gutil.log);
});

gulp.task('web-nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'server/index.js',            // The entry point
    watch: [ // The files to watch for changes in
      'server/**/*',
      'public/**/*',
      'src/**/*',
    ],
  })
  .on('start', function onStart() {
    if (!called) { cb(); }          // To stop it constantly restarting
    called = true;
  })
  .on('restart', function onRestart() {
    setTimeout(function reload() {  // reload after short pause
      browserSync.reload({
        stream: false
      });
    }, 500);
  });
});

gulp.task('web', ['web-nodemon', 'web-public-html', 'web-public-js', 'web-server-js'], function () {
  browserSync.init({
    files: ['server/**/*.*', 'public/**/*.*'],
    proxy: 'https://localhost:5000',
    port: 5001,
    browser: ['chrome']   // Default browser to open
  });
  gulp.watch(web_paths.serverJs.src, ['web-server-js']);    // Watch and update scripts
  gulp.watch(web_paths.publicJs.src, ['web-public-js']);    // Watch and update scripts
  // gulp.watch(CONFIG.SOURCE_ROOT+'/**/*.{css,less}',  ['styles']);     // Watch and update styles
  gulp.watch(['server/**/*', 'public/**/*']).on('change', browserSync.reload);  // Refresh the browser when any of the sources changes
  gulp.watch(['src/**/*.{pug,less}']).on('change', browserSync.reload);           // Refresh browser when jade views change
});


gulp.task('default', ['web-public-js', 'mobile-app1-prepare']);
