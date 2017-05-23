'use strict';

module.exports = ['$locationProvider', function($locationProvider) {
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
}];
