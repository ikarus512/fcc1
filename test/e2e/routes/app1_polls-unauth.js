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
    appUrl = browser.baseUrl,
    mobileApp = process.env.MOBILE_APP_TEST;

describe('app1_polls-unauth: app1 unauth user', function() {

    var initialPolls;

    beforeEach(function() {
        // Log Out if any
        browser.driver.manage().deleteAllCookies();
        browser.driver.get(appUrl + '/logout');
        browser.driver.get(appUrl + '/');
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');

        // Go to app1 page
        browser.driver.get(appUrl + (mobileApp ? '/app1/polls' : '/app1'));
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/app1/polls');

        // Save initially visible polls
        initialPolls = element.all(by.repeater('poll in polls'));
    });

    it('should view polls', function() {
        expect(initialPolls.count()).to.eventually.be.above(1);
        expect(initialPolls.get(0).getText()).to.eventually.equal('Poll 1');
        expect(initialPolls.get(1).getText()).to.eventually.equal('Poll 2');
    });

    it('should not add polls', function() {
        browser.driver.manage().deleteAllCookies();
        browser.driver.get(appUrl + '/app1/polls');
        browser.driver.manage().deleteAllCookies();

        if (!process.env.MOBILE_APP_TEST) {
            var createNewPollButton = browser.driver.findElement(by.id('createNewPollButton'));
            expect(createNewPollButton.isDisplayed()).to.eventually.equal(false);
        }

        // initialPolls.get(0).click();
    });

});
