/* file: statmon-options.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Status Monitor Options
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var expressStatusMonitorOptions = {
    title: 'Express Status Monitor',
    path: '/statmon',
    spans: [{
        interval: 60,           // Every minute
        retention: 100           // Keep 60 datapoints in memory (60 minutes)
    }, {
        interval: 60 * 60,        // Every hour
        retention: 24           // (24 hours)
    }, {
        interval: 24 * 60 * 60,     // Every day
        retention: 28           // (28 days)
    }]
};

module.exports = expressStatusMonitorOptions;
