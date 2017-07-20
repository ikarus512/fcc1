/* file: protractor-conf.js */
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

    baseUrl: 'https://localhost:5000/',
    seleniumServerJar: './../../node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
    seleniumPort: 4444,
    seleniumArgs: '',
    directConnect: true,

    // getPageTimeout: 10000,
    // allScriptsTimeout: 10000,
    rootElement: '.ng-app', // element where ng-app directive used

    framework: 'mocha',
    mochaOpts: {
        reporter: 'dot',
        // defaultTimeoutInterval: 10000,
        // enableTimeouts: false,
        timeout: 20000,//10000,
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
