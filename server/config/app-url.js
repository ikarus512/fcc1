'use strict';

var appUrls = {
  production:   process.env.APP_URL,
  development:  process.env.APP_URL,
  test:         process.env.APP_URL,
};

module.exports = appUrls[process.env.NODE_ENV];
