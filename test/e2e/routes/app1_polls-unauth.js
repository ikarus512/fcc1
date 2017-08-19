/* file: app1_polls-unauth.js */
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
    // appUrl = require('./../../../server/config/app-url.js');
    appUrl = browser.baseUrl;

describe('app1_polls-unauth: app1 unauth user', function() {

    var initialPolls;

    beforeEach(function() {
        // Log Out if any
        browser.ignoreSynchronization = true; // Do not wait for Angular on this page

        browser.driver.manage().deleteAllCookies();
        browser.driver.get(appUrl + '/logout');
        browser.driver.get(appUrl + '/');
        browser.driver.sleep(100);
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');

        // Go to app1 page
        if (process.env.MOBILE_APP_TEST) { browser.driver.get(appUrl + '/app1/polls'); }
        else { browser.driver.get(appUrl + '/app1'); }
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/app1/polls');

        // Wait for new page load after last .click()
        browser.driver.sleep(100);
        browser.waitForAngular();

        // Save initially visible polls
        initialPolls = element.all(by.repeater('poll in polls'));
        browser.driver.sleep(100);
        browser.waitForAngular();
    });

    it('should view polls', function() {
        browser.ignoreSynchronization = false;
        // browser.pause(); // webDriver debug

        browser.driver.sleep(100);
        expect(initialPolls.count()).to.eventually.be.above(1);
        expect(initialPolls.get(0).getText()).to.eventually.equal('Poll 1');
        expect(initialPolls.get(1).getText()).to.eventually.equal('Poll 2');
    });

    it('should not add polls', function() {
        browser.ignoreSynchronization = false;

        browser.driver.manage().deleteAllCookies();
        browser.driver.sleep(100);
        browser.driver.get(appUrl + '/app1/polls');
        browser.driver.sleep(100);
        browser.driver.manage().deleteAllCookies();
        browser.driver.sleep(100);
        browser.waitForAngular();

        if (!process.env.MOBILE_APP_TEST) {
            var createNewPollButton = element(by.id('createNewPollButton'));
            expect(createNewPollButton.isDisplayed()).to.eventually.equal(false);
        }

        // initialPolls.get(0).click();
    });

});
