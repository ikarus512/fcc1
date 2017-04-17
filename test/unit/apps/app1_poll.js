/* file: app1_poll.js */
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

//require('../../public/js/app1_poll.js');

describe('todo angular view', function() {
  // https://github.com/sakshisingla/Protractor-Non-Angular-Tests/wiki/Creating-test-scripts-using-Protractor-for-non-angular-application

  var $httpBackend, $rootScope, createController, authRequestHandler;

  // Set up the module
  beforeEach(module('myApp1Poll'));

  beforeEach(inject( function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    authRequestHandler = $httpBackend;
//     .when('GET', 'https://localhost:5000/app1/polls')
// //    .respond({userId: 'userX'}, {'A-Token': 'xxx'});
//     .respond([
//       {'text':'11',             'done':true, 'id':38},
//       {'text':'qwdqewdq',       'done':false,'id':37},
//       {'text':'aaaa',           'done':false,'id':31},
//       {'text':'wethw rth wrth', 'done':true, 'id':30},
//       {'text':'aaaaaq',         'done':false,'id':20},
//       {'text':'qwdqwd',         'done':false,'id':39}
//     ]);

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('myApp1PollController', {'$scope' : $rootScope });
    };
  }));

  afterEach( function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be on angular view page', function() {
    var controller = createController();
    expect($rootScope.todos.length).toBe(0);
    $httpBackend.flush();
    expect($rootScope.todos.length).toBe(6);
  });
});
