/* file: errors.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Server Reported Internal Errors Description
 * AUTHOR: ikarus512
 * CREATED: 2017/03/13
 *
 * MODIFICATION HISTORY
 *  2017/04/04, ikarus512. Added copyright header.
 *
 */

/*jshint node: true*/
'use strict';

var internalErrors = {
  'e000000d': 'Error during DELETE /app4/api/books/:id',
  'e000000c': 'Error during GET /app4/api/books/:id',
  'e000000b': 'Error during GET /app4/api/books',
  'e000000a': 'Error during POST /app4/api/books',
  'e0000009': 'Error during GET /app3/api/get-ws-ticket',
  'e0000008': 'Error during PUT /app2/api/cafes/:cafeId/timeslots/:startTimeUTC/unplan',
  'e0000007': 'Error during PUT /app2/api/cafes/:cafeId/timeslots/:startTimeUTC/plan',
  'e0000006': 'Error in app.route(\'/auth/local/signup\').',
  'e0000005': 'Error in githubVerify().',
  'e0000004': 'Error in twitterVerify().',
  'e0000003': 'Error in facebookVerify().',
  'e0000002': 'Error in localVerify().',
  'e0000001': 'Error in passport.deserializeUser().',
  'e0000000': 'After creation of new local user, problem loging in as just created new user.',
};
