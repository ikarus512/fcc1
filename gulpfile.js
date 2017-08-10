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

/*jshint node: true*/
'use strict';

var
  browserSync   = require('browser-sync'),
  // cssLint       = require('gulp-csslint'),
  cssMin        = require('gulp-clean-css'),
  changed       = require('gulp-changed'),
  // debug         = require('gulp-debug'), // .pipe(debug({verbose: true}))
  // es            = require('event-stream'), // For working with streams rather than temp dirs
  // eslint        = require('gulp-eslint'),
  exec          = require('child_process').exec,
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  headerfooter  = require('gulp-headerfooter'),
  htmlMin       = require('gulp-htmlmin'),
  jscs          = require('gulp-jscs'),
  jshint        = require('gulp-jshint'),
  jshintStylish = require('jshint-stylish'),
  less          = require('gulp-less'),
  mkdirs        = require('mkdirs'),
  nodemon       = require('gulp-nodemon'),
  path          = require('path'),
  pug           = require('gulp-pug'),
  pugParams     = require('./src/views/pug-params.js').mobile,
  rename        = require('gulp-rename'),
  // runSequence   = require('run-sequence'),
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
var MOBILE_PATHS = {
    indexHtml: {
        src: MOBILE_SRC + 'src/views/mobile/_app_index.pug',
        srcRename: '_app_index',
        dstRename: 'index',
        dest: MOBILE_DST
    },
    favicon: {
        src: MOBILE_SRC + 'public/favicon.ico',
        dest: MOBILE_DST
    },
    cordovaJs: {
        src: MOBILE_SRC + 'src/js/mobile/cordova.js',
        dest: MOBILE_DST
    },
    // jsComponents: {
    //       MOBILE_SRC + 'src/js/common/_components/input-price-update.html'
    // },
    js: {
        src: [
          MOBILE_SRC + 'src/js/**/*.{js,html}' // js and templates
        ],
        base: MOBILE_SRC + 'src/js/',
        dest: MOBILE_DST + 'js/'
    },
    copy: {
        src: [
          MOBILE_SRC + 'public/lib/**/*',
          MOBILE_SRC + 'public/css/**/*', // cssMin
          MOBILE_SRC + 'public/fonts/**/*',
          MOBILE_SRC + 'public/img/**/*'
        ],
        base: MOBILE_SRC + 'public/',
        dest: MOBILE_DST
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
          MOBILE_SRC + 'src/views/common/app5_pinter.pug'
        ],
        dest: MOBILE_DST + 'views/'
    },
    less: {
        hdr: '/*! (C) 2017 https://github.com/ikarus512 */',
        src: [MOBILE_SRC + 'src/less/_dynapps.less',
               MOBILE_SRC + 'src/less/_mobile.less'],
        dest: MOBILE_DST + 'less/'
    }
};

gulp.task('mobile-public-libs-copy', function() {
// bootstrap
// leaflet
    // return gulp.src(MOBILE_PATHS.copy.src, {base: MOBILE_PATHS.copy.base})
    // .pipe(gulp.dest(MOBILE_PATHS.copy.dest));
});

gulp.task('mobile-app1-copy', ['mobile-public-libs-copy'], function() {
    return gulp.src(MOBILE_PATHS.copy.src, {base: MOBILE_PATHS.copy.base})
    .pipe(gulp.dest(MOBILE_PATHS.copy.dest));
});

gulp.task('mobile-app1-js', function() {
    return gulp.src(MOBILE_PATHS.js.src, {base: MOBILE_PATHS.js.base})
    .pipe(gulp.dest(MOBILE_PATHS.js.dest));
});

gulp.task('mobile-app1-cordovaJs', function() {
    return gulp.src(MOBILE_PATHS.cordovaJs.src)
    .pipe(gulp.dest(MOBILE_PATHS.cordovaJs.dest));
});

gulp.task('mobile-app1-indexHtml', function() {
    return gulp.src(MOBILE_PATHS.indexHtml.src)
    .pipe(pug({locals: pugParams}))
    .pipe(rename(function(path) {
        if (path.basename === MOBILE_PATHS.indexHtml.srcRename) {
            path.basename = MOBILE_PATHS.indexHtml.dstRename;
        }
    }))
    .pipe(gulp.dest(MOBILE_PATHS.indexHtml.dest));
});

gulp.task('mobile-app1-favicon', function() {
    return gulp.src(MOBILE_PATHS.favicon.src)
    .pipe(gulp.dest(MOBILE_PATHS.favicon.dest));
});

gulp.task('mobile-app1-views', function() {
    return gulp.src(MOBILE_PATHS.views.src)
    // .pipe(changed(MOBILE_PATHS.views.dest, {extension: '.html'}))
    .pipe(pug({locals: pugParams}))
    .pipe(gulp.dest(MOBILE_PATHS.views.dest));
});

gulp.task('mobile-app1-less', function() {
    return gulp.src(MOBILE_PATHS.less.src)
    // .pipe(changed(MOBILE_PATHS.less.dest, {extension: '.css'}))
    .pipe(less().on('error', gutil.log))
    .pipe(cssMin({compatibility: 'ie8'}))
    .pipe(headerfooter.header(MOBILE_PATHS.less.hdr))
    .pipe(gulp.dest(MOBILE_PATHS.less.dest));
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
      'devserver-public-js'
]);

var WEB_SRC = './';
var WEB_DST = 'public/';
var DEV_SERVER_PATHS = {
    publicJs: {
        hdr: '/*! (C) 2017 https://github.com/ikarus512 */',
        src: [
            WEB_SRC + 'src/js/common/**/*.js',
            WEB_SRC + 'src/js/web/**/*.js'
        ],
        base: WEB_SRC + 'src/js/',
        dest: WEB_DST + 'js/'
    },
    // publicCss: {
    //     hdr: '/*! (C) 2017 https://github.com/ikarus512 */',
    //     src: [
    //         WEB_SRC + 'src/css/**/*.css' // angular templates
    //     ],
    //     base: WEB_SRC + 'src/css/',
    //     dest: WEB_DST + 'css/'
    // },
    publicHtml: {
        hdr: '<!-- (C) 2017 https://github.com/ikarus512 -->',
        src: [
            WEB_SRC + 'src/js/common/**/*.html' // angular templates
        ],
        base: WEB_SRC + 'src/js/',
        dest: WEB_DST + 'js/'
    },
    serverJs: {
        src: WEB_SRC + 'server/**/*.js'
    },
    binaries: {
        src: WEB_SRC + 'mobile/fcc1apps/platforms/android/' +
          'build/outputs/apk/android-release-unsigned.apk',
        srcRename: 'android-release-unsigned',
        dstRename: 'ikarus512-fcc1apps',
        dest: WEB_DST + 'bin/'
    }
};

gulp.task('devserver-binaries-update', function() {
    return gulp.src(DEV_SERVER_PATHS.binaries.src)
    .pipe(rename(function(path) {
        if (path.basename === DEV_SERVER_PATHS.binaries.srcRename) {
            path.basename = DEV_SERVER_PATHS.binaries.dstRename;
        }
    }))
    .pipe(gulp.dest(DEV_SERVER_PATHS.binaries.dest));
});

gulp.task('devserver-public-html', function() { // jshint/minify/copy to public
    return gulp.src(DEV_SERVER_PATHS.publicHtml.src, {base: DEV_SERVER_PATHS.publicHtml.base})
    .pipe(htmlMin({
        // https://github.com/kangax/html-minifier
        collapseWhitespace: true,
        // caseSensitive: true, // attributes
        removeComments: true
    }))
    .pipe(headerfooter.header(DEV_SERVER_PATHS.publicHtml.hdr))
    .pipe(gulp.dest(DEV_SERVER_PATHS.publicHtml.dest))
    .on('error', gutil.log);
});

gulp.task('devserver-public-js', function() { // jshint/minify/copy to public
    return gulp.src(DEV_SERVER_PATHS.publicJs.src, {base: DEV_SERVER_PATHS.publicJs.base})
    .pipe(changed(DEV_SERVER_PATHS.publicJs.dest))
    .pipe(jscs())
    .pipe(jscs.reporter('inline'))
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish))
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .pipe(uglify())
    .pipe(headerfooter.header(DEV_SERVER_PATHS.publicJs.hdr))
    .pipe(gulp.dest(DEV_SERVER_PATHS.publicJs.dest))
    .on('error', gutil.log);
});

gulp.task('devserver-server-js', function() { // Only syntax check
    return gulp.src(DEV_SERVER_PATHS.serverJs.src)
    .pipe(changed(DEV_SERVER_PATHS.serverJs.src))
    .pipe(jscs())
    .pipe(jscs.reporter('inline'))
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish))
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    .on('error', gutil.log);
});

gulp.task('mongo-start', function() {
    var paths = {
        dbDir: './_tmp/dbDir',
        dbLogs: './_tmp/dbLogs'
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
    'devserver-server-js'
]);

gulp.task('devserver', ['mongo-start', 'devserver-build'], function(cb) {

    gulp.watch(DEV_SERVER_PATHS.publicHtml.src, ['devserver-public-html']);
    gulp.watch(DEV_SERVER_PATHS.publicJs.src, ['devserver-public-js']);
    gulp.watch(DEV_SERVER_PATHS.serverJs.src, ['devserver-server-js']);

    return nodemon({
        script: 'server/index.js',            // The entry point
        watch: [
          // The files to watch for changes in
          'server/**/*',
          // 'public/**/*',
          // 'src/js/**/*',
          'src/views/**/*',
          'src/less/**/*'
        ],
        // 'ignore': [ '.git' ],
        // 'verbose': true,
        // 'env': { 'NODE_ENV': 'development' },
        ext: 'js pug less',
        // tasks: ['devserver-build'],
        tasks: function(changedFiles) {
            var tasks = [];
            if (!changedFiles) { return tasks; }
            changedFiles.forEach(function(file) {
                console.log(
                    '----------------------------------------' +
                    '----------------------------------------'
                );
                console.log('changed file: ' + file);
                // if (file.match(/^src\/views/))
                //     if (!~tasks.indexOf('lint')) tasks.push('lint');
                // if (path.extname(file) === '.js' && !~tasks.indexOf('lint'))
                //     tasks.push('lint');
                // if (path.extname(file) === '.js' && !~tasks.indexOf('devserver-server-js'))
                //     tasks.push('devserver-server-js');
                // if(path.extname(file)==='.css'&&!~tasks.indexOf('cssmin'))tasks.push('cssmin');
                //
                // if (file.match(RegExp(DEV_SERVER_PATHS.publicJs.regExp,''))) {
                //     console.log('match with',DEV_SERVER_PATHS.publicJs.regExp)
                //     if (!~tasks.indexOf('devserver-public-js')) {
                //         tasks.push('devserver-public-js');
                //     }
                // }
            });
            return tasks;
        },
        // nodeArgs: ['--debug'],
        // legacyWatch: true,
        // options: '--delay 4', //'--delay 1500ms',
        delay: 500 // to prevent restarting twice
    })
    // .on('restart', ['devserver-build'])
    // .on('start',  function(a) { console.log('-start!',a); }) //['watch'])
    // .on('restart', function(a) { console.log('-restarted!',a); })
    ;
});

gulp.task('default', [
    'devserver-build',
    'mobile-app1-prepare'
]);

////////////////////////////////////////////////////////////////////////////////
var ALL_JS = [
    // 'public/**/*.js'
    'server/**/*.js',
    'src/**/*.js',
    'test/**/*.js'
];
gulp.task('jscs', function() { // only syntax check
    return gulp.src(ALL_JS)
    .pipe(jscs())
    // .pipe(jscs.reporter('inline'))
    .pipe(jscs.reporter('./gulp.jscs.reporter.js'))
    .on('error', gutil.log);
});
