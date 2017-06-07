var cordovaBuild = require('taco-team-build');
  // path = require('path'), //path.join(__dirname, '../logs/'),
  // fs = require('fs'),

cordovaBuild.configure({
  nodePackageName: 'cordova-cli',
  moduleCache: '_tmp_cordova_cache', //'D:\\path\\to\\cache', //CORDOVA_CACHE
  moduleVersion: '5.4.0', // cordova-cli@6.0.0
  projectPath: 'mobile/fcc1apps',
});

module.exports = {
  browser: function() {
    var
      platforms = ['browser'],
      // args = { browser: ['--release', '--gradleArg=--no-daemon']};
      args = { android: ['--release', '--device', '--gradleArg=--no-daemon']};
    return cordovaBuild.buildProject(platforms, args).done();
  },

// gulp.task("default", function (callback) {
//     cordova.build({
//         "platforms": ["android"],
//         "options": {
//             argv: ["--release","--gradleArg=--no-daemon"]
//         }
//     }, callback);
// });

};
