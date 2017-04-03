'use strict';

var expressStatusMonitorOptions = {
  title: 'Express Status Monitor',
  path: '/statmon',
  spans: [{
      interval: 60,           // Every minute
      retention: 100           // Keep 60 datapoints in memory (60 minutes)
    }, {
      interval: 60*60,        // Every hour
      retention: 24           // (24 hours)
    }, {
      interval: 24*60*60,     // Every day
      retention: 28           // (28 days)
  }]
};

module.exports = expressStatusMonitorOptions;
