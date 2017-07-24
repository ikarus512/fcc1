/* file: db-init-test-app1.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: App1 Test Data
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var
    Poll = require('../models/app1-polls.js'),
    Promise = require('bluebird');

function myInit(userA, userB, userU) {

    var promises = [

      // Create poll 1
      new Promise(function(resolve) {
        var p = new Poll();
        p.title = 'Poll 1';
        p.createdBy = userA._id;
        p.options = [
          {title: 'Option 1', votes:[userB._id]},
          {title: 'Option 2', votes:[]},
        ];
        return resolve(p.save());
    }),

      // Create poll 2
      new Promise(function(resolve) {
        var p = new Poll();
        p.title = 'Poll 2';
        p.createdBy = userB._id;
        p.options = [
          {title: 'Option 1', votes:[userB._id,userA._id]},
          {title: 'Option 2', votes:[userU._id]},
        ];
        return resolve(p.save());
    }),

    ];

    return Promise.all(promises);

}

module.exports = myInit;
