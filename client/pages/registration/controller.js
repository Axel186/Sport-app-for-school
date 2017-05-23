'use strict';

var displayResponse = require("../../helpers/utils").displayResponse;

module.exports = ['Auth', function(Auth) {
  var self = this;

  self.submit = function() {
    if (self.newUser.password != self.newUser.re_password) {
      displayResponse(false, "Passwords are not the same.", self)
      return;
    }

    if (self.newUser.password.length < 8) {
      displayResponse(false, "Password must be at least 8 characters.", self)
      return;
    }

    Auth.registration(self.newUser.name, self.newUser.email, self.newUser.password)
      .then(function(res) {
        displayResponse(res.status, res.message, self)

        if (res.status) {
          self.newUser = {};
        }
      })
  }
}];
