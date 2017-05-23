'use strict';

var displayResponse = require("../../helpers/utils").displayResponse;

module.exports = ['$location', 'Auth', function($location, Auth) {
  var self = this;

  self.submit = function() {
    // Validation...

    Auth.login(self.user.email, self.user.password)
      .then(function(res) {
        displayResponse(res.status, res.message, self);

        if (res.status) {
          $location.path("/");
        }
      })
  }
}];
