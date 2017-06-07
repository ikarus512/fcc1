var
  // copy = require('gulp-copy'),
  debug = require('gulp-debug'),
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  less = require('gulp-less'),
  // notify = require('gulp-notify'),
  path = require('path'),
  util = require('gulp-util');

  // coffee = require('gulp-coffee'),
  // concat = require('gulp-concat'),
  // uglify = require('gulp-uglify'),
  // imagemin = require('gulp-imagemin'),
  // sourcemaps = require('gulp-sourcemaps'),
  // del = require('del'),

var MOBILE_SRC = ''; //'../fcc1/';
var MOBILE_WWW = 'mobile/fcc1apps/www/'; //'www/';

var mobile_paths = {
  // scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  indexHtml: {
    src: MOBILE_SRC + 'src/views/mobile/index.pug',
    dest: MOBILE_WWW,
  },
  cordovaJs: {
    src: MOBILE_SRC + 'src/js/mobile/cordova.js',
    dest: MOBILE_WWW,
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
    dest: MOBILE_WWW + 'js/',
  },
  copy: {
    src : [
      MOBILE_SRC + 'public/lib/*',
      MOBILE_SRC + 'public/css/*',
      MOBILE_SRC + 'public/fonts/*',
      MOBILE_SRC + 'public/img/*',
    ],
    base: MOBILE_SRC + 'public/',
    dest: MOBILE_WWW,
  },
  pug: {
    src: [
      MOBILE_SRC + 'src/views/mobile/home.pug',
      MOBILE_SRC + 'src/views/common/app1_poll.pug',
      MOBILE_SRC + 'src/views/common/app1_polls.pug',
    ],
    dest: MOBILE_WWW + 'views/',
  },
  less: {
    src: MOBILE_SRC + 'src/less/_dynapps.less',
    dest: MOBILE_WWW + 'less/',
  },
  // images: 'client/img/**/*',
};

gulp.task('mobile-app1-copy', function buildPug() {
  return gulp.src(mobile_paths.copy.src, {base: mobile_paths.copy.base})
  .pipe(gulp.dest(mobile_paths.copy.dest));
  // .pipe(debug({verbose: true}))
  // .pipe(notify({ message: 'Finished COPY Gulp Tasks'}));
});

gulp.task('mobile-app1-js', function buildPug() {
  return gulp.src(mobile_paths.js.src, {base: mobile_paths.js.base})
  .pipe(gulp.dest(mobile_paths.js.dest));
  // .pipe(debug({verbose: true}))
  // .pipe(notify({ message: 'Finished JS Gulp Tasks'}));
});

gulp.task('mobile-app1-cordovaJs', function buildPug() {
  return gulp.src(mobile_paths.cordovaJs.src)
  .pipe(gulp.dest(mobile_paths.cordovaJs.dest));
  // .pipe(debug({verbose: true}))
  // .pipe(notify({ message: 'Finished cordovaJs Gulp Tasks'}));
});

gulp.task('mobile-app1-indexHtml', function buildPug() {
  return gulp.src(mobile_paths.indexHtml.src)
  .pipe(pug({
    // Your options in here. 
  }))
  .pipe(gulp.dest(mobile_paths.indexHtml.dest));
  // .pipe(notify({ message: 'Finished indexHtml Gulp Tasks'}));
});

gulp.task('mobile-app1-pug', function buildPug() {
  return gulp.src(mobile_paths.pug.src)
  .pipe(pug({
    // Your options in here. 
  }))
  .pipe(gulp.dest(mobile_paths.pug.dest));
  // .pipe(notify({ message: 'Finished PUG Gulp Tasks'}));
});

gulp.task('mobile-app1-less', function buildLess() {
  return gulp.src(mobile_paths.less.src)
  .pipe(less().on('error', util.log))
  // .pipe(concat('master.css')) // concatenate to 
  .pipe(gulp.dest(mobile_paths.less.dest));
  // .pipe(notify({ message: 'Finished LESS Gulp Tasks'}));
});


// // Not all tasks need to use streams 
// // A gulpfile is just another node program and you can use any package available on npm 
// gulp.task('clean', function() {
//   // You can use multiple globbing patterns as you would with `gulp.src` 
//   return del(['build']);
// });

// gulp.task('scripts', ['clean'], function() {
//   // Minify and copy all JavaScript (except vendor scripts) 
//   // with sourcemaps all the way down 
//   return gulp.src(mobile_paths.scripts)
//     .pipe(sourcemaps.init())
//       .pipe(coffee())
//       .pipe(uglify())
//       .pipe(concat('all.min.js'))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build/js'));
// });

// // Copy all static images
// gulp.task('images', ['clean'], function() {
//   return gulp.src(mobile_paths.images)
//     // Pass in options to the task
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest('build/img'));
// });

// // Rerun the task when a file changes
// gulp.task('watch', function() {
//   gulp.watch(mobile_paths.scripts, ['scripts']);
//   gulp.watch(mobile_paths.images, ['images']);
// });

// // The default task (called when you run `gulp` from cli)
// gulp.task('default', ['watch', 'scripts', 'images']);

gulp.task('mobile-app1-build', [
  'mobile-app1-copy',
  'mobile-app1-js',
  'mobile-app1-indexHtml',
  'mobile-app1-cordovaJs',
  'mobile-app1-pug',
  'mobile-app1-less'
]);

//gulp.task('default', ['mobile-app1-build']);
