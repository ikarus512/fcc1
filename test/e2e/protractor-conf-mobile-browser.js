/* file: protractor-conf-mobile-browser.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION:
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

// jscs:disable maximumLineLength

exports.config = {
    // browser.pause(); //https://github.com/angular/protractor/blob/master/docs/debugging.md

    //seleniumAddress: 'http://localhost:4444/wd/hub',
    //localSeleniumStandaloneOpts: {args: '--standalone'},
    specs: ['routes/**/*.js'],

    // baseUrl: 'https://localhost:' + process.env.PORT,
    // baseUrl: 'https://127.0.0.1:' + process.env.PORT,
    // baseUrl: 'https://localhost:5006/index.html#!',
    baseUrl: 'http://localhost:5006/index.html#!',
    seleniumServerJar: './../../node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
    seleniumPort: 4444,
    seleniumArgs: '',
    directConnect: true,

    // getPageTimeout: 10000,
    // allScriptsTimeout: 10000,
//    rootElement: '.ng-app', // element where ng-app directive used, if not body

    framework: 'mocha',
    mochaOpts: {
        reporter: 'dot',
        // defaultTimeoutInterval: 10000,
        // enableTimeouts: false,
        timeout: 40000,//10000,
        // slow: 5000
    },
    // framework: 'jasmine',
    // jasmineNodeOpts: {
    //   showColors: false,
    //   defaultTimeoutInterval: 10000,
    // },

    // onPrepare: '../test-utils.js',

    multiCapabilities: [{
        browserName: 'chrome', // needs to run:   webdriver-manager update
        // shardTestFiles: true, //each spec file in different browser instance
        // maxInstances: 2       //number of instances
        // }, {
        //   browserName: 'firefox'
        // }, {
        // browserName: 'internet explorer', // needs to run:   webdriver-manager update --ie
        // acceptSslCerts: true,
        // trustAllSSLCertificates: true,
        // platform: 'ANY',
        // version: '11'
    }],
    // maxSessions: 4,

    // localSeleniumStandaloneOpts : {
    //   jvmArgs : ['-Dwebdriver.ie.driver=node_modules/protractor/node_modules/webdriver-manager/selenium/IEDriverServer.exe']
    // },

};

// // Start server for testing on port 9201.
// var server = require('child_process').spawn('node', ['server.js', '--port=9201']);
// process.on('exit', function() {
//     server.kill('SIGTERM');
// });

console.log('===');
console.log('baseUrl=',exports.config.baseUrl);
console.log('===');
