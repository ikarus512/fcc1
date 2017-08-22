/* file: login.js */
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

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
/*global by, browser, element */
'use strict';

require('./../test-utils.js');

var
    chai = require('chai').use(require('chai-as-promised')),
    expect = chai.expect,
    appUrl = browser.baseUrl,
    mobileApp = process.env.MOBILE_APP_TEST;

describe('login', function() {
    // https://github.com/sakshisingla/Protractor-Non-Angular-Tests/ ...
    //     wiki/Creating-test-scripts-using-Protractor-for-non-angular-application

    beforeEach(function() {
        browser.driver.get(appUrl + '/');
    });

    // it('should fail when the console has errors - FAILURE EXPECTED', function() {
    //     browser.executeScript(function() {console.error('error from test')});
    // });

    it('should pass when the console has usual log without errors', function() {
        browser.executeScript(function() {console.log('hi!');});
    });

    it('should accept admin login', function() {
        browser.driver.get(appUrl + '/login');
        browser.driver.findElement(by.id('loginUsername')).sendKeys('admin');
        browser.driver.findElement(by.id('loginPassword')).sendKeys('1234');
        browser.driver.findElement(by.id('loginButton')).click();
        browser.waitForAngular();

        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');
    });

    it('should accept admin logout', function() {
        browser.driver.get(appUrl + '/login');
        browser.driver.findElement(by.id('loginUsername')).sendKeys('admin');
        browser.driver.findElement(by.id('loginPassword')).sendKeys('1234');
        browser.driver.findElement(by.id('loginButton')).click();
        browser.waitForAngular();

        if (!process.env.MOBILE_APP_TEST) {
            browser.driver.get(appUrl + '/logout');
            expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');
        }
    });

});
