'use strict';

var dbUrls = {
  production: process.env.APP_MONGODB_URI,
  development: "mongodb://localhost:27017/dbname-dev",
  test: "mongodb://localhost:27017/dbname-test",
};

module.exports = dbUrls[process.env.NODE_ENV];
