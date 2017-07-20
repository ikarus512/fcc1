/* file: app1_polls-auth.js */
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

describe('app1_polls-auth: app1 auth user', function() {

    beforeEach(function() {
        // Log In
        browser.ignoreSynchronization = true; // Do not wait for Angular on this page
        browser.driver.get(appUrl + '/logout');
        browser.driver.get(appUrl + '/login');
        element(by.id('loginUsername')).sendKeys('a');
        element(by.id('loginPassword')).sendKeys('a');
        element(by.id('loginButton')).click();
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/');
    });

    it('should view polls', function() {
        // Go to app1 page
        browser.driver.get(appUrl + '/app1');
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/app1/polls');

        // Save initially visible polls
        var initialPolls = element.all(by.repeater('poll in polls'));

        expect(initialPolls.count()).to.eventually.be.above(1);
        expect(initialPolls.get(0).getText()).to.eventually.equal('Poll 1');
        expect(initialPolls.get(1).getText()).to.eventually.equal('Poll 2');
    });

    it('should add polls', function() {
        // Go to app1 page
        browser.driver.get(appUrl + '/app1');
        expect(browser.driver.getCurrentUrl()).to.eventually.equal(appUrl + '/app1/polls');

        // Press createNewPollButton, enter new poll title, press 'create'
        var createNewPollButton = element(by.id('createNewPollButton'));
        expect(createNewPollButton.isDisplayed()).to.eventually.equal(true);
        createNewPollButton.click();
        element(by.model('newPollTitle')).sendKeys('Poll 3');
        element(by.id('newPollCreate')).click();

        // Wait for new page load after last .click()
        browser.driver.sleep(100);
        browser.waitForAngular();

        var polls = element.all(by.repeater('poll in polls'));
        expect(polls.count()).to.eventually.be.above(2);

        // polls.get(0).click();
    });

});
