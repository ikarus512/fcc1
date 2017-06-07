var
  // copy = require('gulp-copy'),
  debug = require('gulp-debug'), // .pipe(debug({verbose: true}))
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  less = require('gulp-less'),
  path = require('path'),
  util = require('gulp-util');

var MOBILE_SRC = './';
var MOBILE_DST = 'mobile/fcc1apps/www/';
var mobile_paths = {
  indexHtml: {
    src: MOBILE_SRC + 'src/views/mobile/index.pug',
    dest: MOBILE_DST,
  },
  cordovaJs: {
    src: MOBILE_SRC + 'src/js/mobile/cordova.js',
    dest: MOBILE_DST,
  },
  js: {
    src : [
      // mobile app:
      MOBILE_SRC + 'src/js/mobile/app.js',
      MOBILE_SRC + 'src/js/mobile/config-routes.js',
      MOBILE_SRC + 'src/js/mobile/config-httpProvider.js',
      MOBILE_SRC + 'src/js/mobile/service-myConst.js',
      // common:
      MOBILE_SRC + 'src/js/common/app1/controller-poll.js',
      MOBILE_SRC + 'src/js/common/app1/controller-polls.js',
      MOBILE_SRC + 'src/js/common/app1/factory-storage-poll.js',
      MOBILE_SRC + 'src/js/common/app1/factory-storage-polls.js',
      MOBILE_SRC + 'src/js/common/directive-keep-focus.js',
      MOBILE_SRC + 'src/js/common/directive-my-enter.js',
      MOBILE_SRC + 'src/js/common/directive-my-escape.js',
      MOBILE_SRC + 'src/js/common/directive-my-focus.js',
      MOBILE_SRC + 'src/js/common/directive-my-scroll-bottom.js',
      MOBILE_SRC + 'src/js/common/factory-my-error.js',
      MOBILE_SRC + 'src/js/common/removeFacebookAppendedHash.js',
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
  pug: {
    src: [
      MOBILE_SRC + 'src/views/mobile/home.pug',
      MOBILE_SRC + 'src/views/common/app1_poll.pug',
      MOBILE_SRC + 'src/views/common/app1_polls.pug',
    ],
    dest: MOBILE_DST + 'views/',
  },
  less: {
    src: MOBILE_SRC + 'src/less/_dynapps.less',
    dest: MOBILE_DST + 'less/',
  },
};

gulp.task('mobile-app1-copy', function buildPug() {
  return gulp.src(mobile_paths.copy.src, {base: mobile_paths.copy.base})
  .pipe(gulp.dest(mobile_paths.copy.dest));
});

gulp.task('mobile-app1-js', function buildPug() {
  return gulp.src(mobile_paths.js.src, {base: mobile_paths.js.base})
  .pipe(gulp.dest(mobile_paths.js.dest));
});

gulp.task('mobile-app1-cordovaJs', function buildPug() {
  return gulp.src(mobile_paths.cordovaJs.src)
  .pipe(gulp.dest(mobile_paths.cordovaJs.dest));
});

gulp.task('mobile-app1-indexHtml', function buildPug() {
  return gulp.src(mobile_paths.indexHtml.src)
  .pipe(pug({}))
  .pipe(gulp.dest(mobile_paths.indexHtml.dest));
});

gulp.task('mobile-app1-pug', function buildPug() {
  return gulp.src(mobile_paths.pug.src)
  .pipe(pug({}))
  .pipe(gulp.dest(mobile_paths.pug.dest));
});

gulp.task('mobile-app1-less', function buildLess() {
  return gulp.src(mobile_paths.less.src)
  .pipe(less().on('error', util.log))
  .pipe(gulp.dest(mobile_paths.less.dest));
});

gulp.task('mobile-app1-prepare', [
  'mobile-app1-copy',
  'mobile-app1-js',
  'mobile-app1-indexHtml',
  'mobile-app1-cordovaJs',
  'mobile-app1-pug',
  'mobile-app1-less'
]);


var WEB_SRC = './';
var WEB_DST = 'public/';
var web_paths = {
  js: {
    src : [
      WEB_SRC + 'src/js/common/**/*.js',
      WEB_SRC + 'src/js/common/**/*.html', // angular templates
      WEB_SRC + 'src/js/web/**/*.js',
    ],
    base: WEB_SRC + 'src/js/',
    dest: WEB_DST + 'js/',
  },
};

gulp.task('web-build-js', function buildPug() {
  return gulp.src(web_paths.js.src, {base: web_paths.js.base})
  .pipe(gulp.dest(web_paths.js.dest));
});


gulp.task('default', ['web-build-js', 'mobile-app1-prepare']);
