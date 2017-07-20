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
  appUrl = require('./../../../server/config/app-url.js');

describe('app1', function() {
    // https://github.com/sakshisingla/Protractor-Non-Angular-Tests/ ...
    //     wiki/Creating-test-scripts-using-Protractor-for-non-angular-application

    beforeEach(function() {
        //browser().navigateTo('/services')
        browser.ignoreSynchronization = true; // Do not wait for Angular on this page
    });

    it('should accept admin login', function() {
        browser.driver.get(appUrl + '/login');
        element(by.id('loginUsername')).sendKeys('admin');
        element(by.id('loginPassword')).sendKeys('1234');
        element(by.id('loginButton')).click();
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');
    });

    it('should accept admin logout', function() {
        browser.driver.get(appUrl + '/login');
        element(by.id('loginUsername')).sendKeys('admin');
        element(by.id('loginPassword')).sendKeys('1234');
        element(by.id('loginButton')).click();
        browser.driver.get(appUrl + '/logout');
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');
    });

});
