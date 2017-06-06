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

var mobile_paths = {
  // scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  indexHtml: {
    src: '../fcc1/src/views/mobile/index.pug',
    dest: 'www/',
  },
  cordovaJs: {
    src: '../fcc1/src/js/mobile/cordova.js',
    dest: 'www/',
  },
  js: {
    src : [
      // mobile app:
      '../fcc1/src/js/mobile/app.js',
      '../fcc1/src/js/mobile/config-routes.js',
      '../fcc1/src/js/mobile/config-httpProvider.js',
      '../fcc1/src/js/mobile/service-myConst.js',
      // common:
      '../fcc1/src/js/common/app1/controller-poll.js',
      '../fcc1/src/js/common/app1/controller-polls.js',
      '../fcc1/src/js/common/app1/factory-storage-poll.js',
      '../fcc1/src/js/common/app1/factory-storage-polls.js',
      '../fcc1/src/js/common/directive-keep-focus.js',
      '../fcc1/src/js/common/directive-my-enter.js',
      '../fcc1/src/js/common/directive-my-escape.js',
      '../fcc1/src/js/common/directive-my-focus.js',
      '../fcc1/src/js/common/directive-my-scroll-bottom.js',
      '../fcc1/src/js/common/factory-my-error.js',
      '../fcc1/src/js/common/removeFacebookAppendedHash.js',
    ],
    base: '../fcc1/src/js/',
    dest: 'www/js/',
  },
  copy: {
    src : [
      './../fcc1/public/lib/*',
      './../fcc1/public/css/*',
      './../fcc1/public/fonts/*',
      './../fcc1/public/img/*',
    ],
    base: './../fcc1/public/',
    dest: 'www/',
  },
  pug: {
    src: [
      '../fcc1/src/views/mobile/home.pug',
      '../fcc1/src/views/common/app1_poll.pug',
      '../fcc1/src/views/common/app1_polls.pug',
    ],
    dest: 'www/views/',
  },
  less: {
    src: '../fcc1/src/less/_dynapps.less',
    dest: 'www/less/',
  },
  // images: 'client/img/**/*',
};

gulp.task('mobile-app1-copy', function buildPug() {
  return gulp.src(mobile_paths.copy.src, {base: mobile_paths.copy.base})
  .pipe(gulp.dest(mobile_paths.copy.dest))
  // .pipe(debug({verbose: true}))
  // .pipe(notify({ message: 'Finished COPY Gulp Tasks'}));
});

gulp.task('mobile-app1-js', function buildPug() {
  return gulp.src(mobile_paths.js.src, {base: mobile_paths.js.base})
  .pipe(gulp.dest(mobile_paths.js.dest))
  // .pipe(debug({verbose: true}))
  // .pipe(notify({ message: 'Finished JS Gulp Tasks'}));
});

gulp.task('mobile-app1-cordovaJs', function buildPug() {
  return gulp.src(mobile_paths.cordovaJs.src)
  .pipe(gulp.dest(mobile_paths.cordovaJs.dest))
  // .pipe(debug({verbose: true}))
  // .pipe(notify({ message: 'Finished cordovaJs Gulp Tasks'}));
});

gulp.task('mobile-app1-indexHtml', function buildPug() {
  return gulp.src(mobile_paths.indexHtml.src)
  .pipe(pug({
    // Your options in here. 
  }))
  .pipe(gulp.dest(mobile_paths.indexHtml.dest))
  // .pipe(notify({ message: 'Finished indexHtml Gulp Tasks'}));
});

gulp.task('mobile-app1-pug', function buildPug() {
  return gulp.src(mobile_paths.pug.src)
  .pipe(pug({
    // Your options in here. 
  }))
  .pipe(gulp.dest(mobile_paths.pug.dest))
  // .pipe(notify({ message: 'Finished PUG Gulp Tasks'}));
});

gulp.task('mobile-app1-less', function buildLess() {
  return gulp.src(mobile_paths.less.src)
  .pipe(less().on('error', util.log))
  // .pipe(concat('master.css')) // concatenate to 
  .pipe(gulp.dest(mobile_paths.less.dest))
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

gulp.task('default', ['mobile-app1-build']);
