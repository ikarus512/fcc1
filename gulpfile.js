var
  // copy = require('gulp-copy'),
  debug = require('gulp-debug'), // .pipe(debug({verbose: true}))
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  less = require('gulp-less'),
  path = require('path'),
  rename = require('gulp-rename'),
  util = require('gulp-util');

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
      // mobile app:
      MOBILE_SRC + 'src/js/mobile/autologin/controller-autologin.js',
      MOBILE_SRC + 'src/js/mobile/app.js',
      MOBILE_SRC + 'src/js/mobile/config-routes.js',
      MOBILE_SRC + 'src/js/mobile/config-httpProvider.js',
      MOBILE_SRC + 'src/js/mobile/factory-login.js',
      MOBILE_SRC + 'src/js/mobile/factory-myRouteParams.js',
      MOBILE_SRC + 'src/js/mobile/service-myConst.js',
      MOBILE_SRC + 'src/js/mobile/service-user.js',
      // common:
      MOBILE_SRC + 'src/js/common/app1/controller-poll.js',
      MOBILE_SRC + 'src/js/common/app1/controller-polls.js',
      MOBILE_SRC + 'src/js/common/app1/factory-storage-poll.js',
      MOBILE_SRC + 'src/js/common/app1/factory-storage-polls.js',
      MOBILE_SRC + 'src/js/common/app2/controller-main.js',
      MOBILE_SRC + 'src/js/common/app2/directive-map.js',
      MOBILE_SRC + 'src/js/common/app2/factory-cafe-storage.js',
      MOBILE_SRC + 'src/js/common/app3/controller-main.js',
      MOBILE_SRC + 'src/js/common/app3/directive-chart1.js',
      MOBILE_SRC + 'src/js/common/app3/factory-rest.js',
      MOBILE_SRC + 'src/js/common/app3/factory-websocket.js',
      MOBILE_SRC + 'src/js/common/app4/controller-book.js',
      MOBILE_SRC + 'src/js/common/app4/factory-book-storage.js',
      MOBILE_SRC + 'src/js/common/app4/factory-websocket.js',
      MOBILE_SRC + 'src/js/common/app4/filter-msgtime.js',
      MOBILE_SRC + 'src/js/common/app4/filter-photo.js',
      MOBILE_SRC + 'src/js/common/components/input-price-update.js',
        MOBILE_SRC + 'src/js/common/components/input-price-update.html',
      MOBILE_SRC + 'src/js/common/app4/controller-main.js',
      MOBILE_SRC + 'src/js/common/app4/factory-book-storage.js',
      MOBILE_SRC + 'src/js/common/app4/filter-photo.js',

      MOBILE_SRC + 'src/js/common/directive-keep-focus.js',
      MOBILE_SRC + 'src/js/common/directive-my-enter.js',
      MOBILE_SRC + 'src/js/common/directive-my-escape.js',
      MOBILE_SRC + 'src/js/common/directive-my-focus.js',
      MOBILE_SRC + 'src/js/common/directive-my-scroll-bottom.js',
      MOBILE_SRC + 'src/js/common/factory-my-error.js',
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

gulp.task('mobile-app1-indexHtml', function() {
  return gulp.src(mobile_paths.indexHtml.src)
  .pipe(pug({}))
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

gulp.task('mobile-app1-views', function buildPug() {
  return gulp.src(mobile_paths.views.src)
  .pipe(pug({}))
  .pipe(gulp.dest(mobile_paths.views.dest));
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
  'mobile-app1-favicon',
  'mobile-app1-cordovaJs',
  'mobile-app1-views',
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
