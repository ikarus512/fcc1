'use strict';

var HEROKU_APP_URL = 'https://ikarus512-fcc1.herokuapp.com';

function isHeroku() {
  return process.env.APP_URL === HEROKU_APP_URL;
}

module.exports = isHeroku;
