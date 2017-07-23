# fcc1

[![Build Status](https://travis-ci.org/ikarus512/fcc1.svg?branch=master)](https://travis-ci.org/ikarus512/fcc1)
[![Build Status on Windows](https://ci.appveyor.com/api/projects/status/github/ikarus512/fcc1?branch=master&svg=true)](https://ci.appveyor.com/project/ikarus512/fcc1)

[![Coverage Status](https://coveralls.io/repos/github/ikarus512/fcc1/badge.svg)](https://coveralls.io/github/ikarus512/fcc1) <!-- [![Code Coverage](https://codecov.io/gh/ikarus512/fcc1/branch/master/graph/badge.svg)](https://codecov.io/gh/ikarus512/fcc1) -->
[![Code Climate](https://codeclimate.com/github/ikarus512/fcc1/badges/gpa.svg)](https://codeclimate.com/github/ikarus512/fcc1) <!-- a(href='https://saucelabs.com/u/chaijs')  img(alt="Selenium Test Status", src="https://saucelabs.com/browser-matrix/chaijs.svg") --> <!-- [![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/github/ikarus512/fcc1.svg)](https://codeclimate.com/github/ikarus512/fcc1) -->
[![Code Climate Issues](https://img.shields.io/codeclimate/issues/github/ikarus512/fcc1.svg)](https://codeclimate.com/github/ikarus512/fcc1/issues)

[![Dependency Status](https://dependencyci.com/github/ikarus512/fcc1/badge)](https://dependencyci.com/github/ikarus512/fcc1)
[![Dependencies](https://david-dm.org/ikarus512/fcc1.svg)](https://david-dm.org/ikarus512/fcc1)
[![DevDependencies](https://david-dm.org/ikarus512/fcc1/dev-status.svg)](https://david-dm.org/ikarus512/fcc1#info=devDependencies)

[![GitHub Version of ikarus512/fcc1](https://badge.fury.io/gh/ikarus512%2Ffcc1.svg)](https://badge.fury.io/gh/ikarus512%2Ffcc1)
[![GitHub Version of ikarus512/fcc1](https://img.shields.io/github/tag/ikarus512/fcc1.svg)](https://badge.fury.io/gh/ikarus512%2Ffcc1)
![Node Version](https://img.shields.io/badge/node-%3E=6.0-brightgreen.svg)
![NPM Version](https://img.shields.io/badge/npm-%3E=5.0-brightgreen.svg)
[![Coding Standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![License](https://img.shields.io/github/license/ikarus512/fcc1.svg?label=lic&maxAge=2592000&colorB=4bc51d)](https://github.com/ikarus512/fcc1/blob/master/LICENSE)


FreeCodeCamp.com developement tasks. Running application available at https://ikarus512-fcc1.herokuapp.com




Server side on Node.js platform using Express.js. References Google Places API, MongoDB on mlab.com through Mongoose.

Web clients applications written using Angular 1.5, Bootstrap, WebSocket, D3, Chart.js, Google Maps API.

Android application with same functionality available to download through the link on home page of web application.
Written on Apache Cordova platform. Sources are in ./mobile folder.
Mobile application references same server REST API/Websocket API that uses web application.
Uses Leaflet.js with online/offline map instead of Google Maps API.
<!-- [![Android App File Size](https://img.shields.io/github/size/ikarus512/fcc1/blob/master/public/bin/ikarus512-fcc1apps.apk.svg)](https://david-dm.org/ikarus512/fcc1#info=devDependencies) -->

Using same JavaScript source and pug templates shared by both web and mobile application (see ./src folder).

--------------------------------------------------------------------------------

## app1: Voting App
Accessible via 'Voting' menu.

### Task
Build a Voting App similar to [this](https://fcc-voting-arthow4n.herokuapp.com)

+ User Story: As an authenticated user, I can keep my polls and come back later to access them.
+ User Story: As an authenticated user, I can share my polls with my friends.
+ User Story: As an authenticated user, I can see the aggregate results of my polls.
+ User Story: As an authenticated user, I can delete polls that I decide I don't want anymore.
+ User Story: As an authenticated user, I can create a poll with any number of possible items.
+ User Story: As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
+ User Story: As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)
+ User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.


--------------------------------------------------------------------------------

## app2: Nightlife Coordination App
Accessible via 'Nightlife' menu.

### Task
Build a Nightlife Coordination App
similar to [this](http://whatsgoinontonight.herokuapp.com)

+ User Story: As an unauthenticated user, I can view all bars in my area.
+ User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
+ User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there.
+ User Story: As an unauthenticated user, when I login I should not have to search again.
+ Hint: Try using the Yelp API to find venues in the cities your users search for.
  https://www.yelp.com/developers/documentation/v2/overview
  If you use Yelp's API, be sure to mention so in your app.

Optional features maybe to do in future:

- TODO: List my reservations, show on map.
- TODO: List another user's reservations (search by his name), show on map.
- TODO: Download photos using Google Place Photo API.


--------------------------------------------------------------------------------

## app3: Chart the Stock Market
Accessible via 'Stock' menu.

### Task
Chart the Stock Market
similar to [this](http://watchstocks.herokuapp.com)

+ User Story: I can view a graph displaying the recent trend lines for each added stock.
+ User Story: I can add new stocks by their symbol name.
+ User Story: I can remove stocks.
+ User Story: I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.


--------------------------------------------------------------------------------

## app4: Book Trading Club
Accessible via 'Books' menu.

### Task
Manage a Book Trading Club
similar to [this](http://bookjump.herokuapp.com)

+ User Story: I can view all books posted by every user.
+ User Story: I can add a new book.
+ User Story: I can update my settings to store my full name, city, and state.
+ User Story: I can propose a trade and wait for the other user to accept the trade.

Optional features maybe to do in future:

- TODO: Books list filter: all|my offers|my bids|by keywords.
- TODO: Books list pages (temporary query in DB: query ID, query params, current page).
- TODO: Unused photos cleanup from disk and DB.
- TODO: Mail notifications about trade.


--------------------------------------------------------------------------------

## app5: Pinterest Clone
Accessible via 'Pinter' menu.

### Task
Build a Pinterest Clone
similar to [this](https://midnight-dust.hyperdev.space)

- User Story: As an unauthenticated user, I can login with Twitter.
- User Story: As an authenticated user, I can link to images.
- User Story: As an authenticated user, I can delete images that I've linked to.
- User Story: As an authenticated user, I can see a Pinterest-style wall of all the images I've linked to.
- User Story: As an unauthenticated user, I can browse other users' walls of images.
- User Story: As an authenticated user, if I upload an image that is broken, it will be replaced by a placeholder image. (can use jQuery broken image detection)
- Hint: Masonry.js is a library that allows for Pinterest-style image grids.
