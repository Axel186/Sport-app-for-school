'use strict';

module.exports = ['$location', 'Auth', function($location, Auth) {
  var self = this;

  Auth.logOut();

  self.goToLogin = function() {
    $location.path("/login");
  }

  setTimeout(function() {
    document.getElementById('goToLogin').click();
  }, 100)
}];
