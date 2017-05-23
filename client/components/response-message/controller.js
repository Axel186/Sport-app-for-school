'use strict';

module.exports = ['$location', 'Auth', function($location, Auth) {
  var self = this;

  self.detectClass = function() {
    var className = "alert-" + self.response.type;
    return className;
  }
}];
