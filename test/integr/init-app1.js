/* file: init-app1.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App1 Test Initializations
 * AUTHOR: ikarus512
 * CREATED: 2017/07/18
 *
 * MODIFICATION HISTORY
 *  2017/07/18, ikarus512. Initial version.
 *
 */

/*jshint node: true*/
/*global describe, it, before, beforeEach, after, afterEach */
'use strict';

var
    Poll = require('./../../server/models/app1-polls.js'),
    usersInit = require('./init-users.js'),
    Promise = require('bluebird'),

    result,
    polls = [],

    titles = [
        // titles for polls to test
        'userA question poll 0',
        'userA question poll 1',
        'userU question poll 2',
        'userU question poll 3',
    ];

function pollsInit(opts) {

    //  opts = {
    //    userA, userB, userU, // a, b, unonimous
    //    titles, // poll titles
    //  }

    var promises = opts.titles.map(function(title,i) {

        return Poll

        .findOneAndRemove({title:title}).exec()
        .catch(function(err) { return; }) // Ignore if not found

        .then(function() {
            var p = new Poll();
            p.title = title;

            if ((i & 1) === 0) { // even i
                p.createdBy = opts.userA._id;
                p.options = [
                  {title: 'Option 1', votes:[opts.userB._id]},
                  {title: 'Option 2', votes:[]},
                ];
            } else { // odd i
                p.createdBy = opts.userB._id;
                p.options = [
                  {title: 'Option 1', votes:[opts.userB._id,opts.userA._id]},
                  {title: 'Option 2', votes:[opts.userU._id]},
                ];
            }
            return Promise.resolve(p.save());
        })
        .then(function(poll) {
            polls[i] = JSON.parse(JSON.stringify(poll));
        });
    });

    return Promise.all(promises)

    .then(function() {
        return {
            polls: polls,
        };
    });

}

function initApp1Data() {
    var resultTmp = {titles: titles};

    if (result) {
        return Promise.resolve(result);
    }

    // Init polls:
    return usersInit()
    .then(function(res) {
        resultTmp.users = res;
        return res;
    })
    .then(function(users) {
        var aOpts = users;
        aOpts.titles = titles;
        return pollsInit(aOpts);
    })
    .then(function(res) {
        resultTmp.polls = res.polls;
        result = resultTmp;
        return result;
    });
}

module.exports = initApp1Data;
