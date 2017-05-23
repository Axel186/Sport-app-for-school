'use strict';

var displayResponse = require("../../helpers/utils").displayResponse;

module.exports = ['$timeout', 'Account', 'Auth', function($timeout, Account, Auth) {
  var self = this;

  self.errors = {};
  self.message = "";

  self.types = ["Regular User", "User Manager", "Administrator"];

  this.$routerOnActivate = function(next) {
    if (next.params.userId) {
      self.userId = next.params.userId;
    }

    Account.getProfile(self.userId)
      .then(function(res) {
        self.setProfile(res.data);
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      });

    self.getCurrentAccount();
  };

  self.getCurrentAccount = function() {
    Auth.getAccount()
      .then(function(profile) {
        self.currentRole = profile.type;
        self.prepareRoles();
        $timeout();
      });
  }

  self.prepareRoles = function() {
    self.roles = [];

    for (let i = 1; i <= parseInt(self.currentRole); i++) {
      self.roles.push({
        value: i,
        text: self.types[i - 1]
      });
    }
  }

  self.submit = function() {
    if (!self.validatePassword()) {
      return;
    }

    Account.updateProfile(self.profile)
      .then(function(res) {
        self.loading = true;
        self.setProfile(res.data);
        self.getCurrentAccount();

        displayResponse(res.status, res.message, self);
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      })
      .then(function() {
        self.loading = false;
      });
  };

  self.setProfile = function(profile) {
    if (Auth.account.uuid == profile.uuid) {
      Auth.setAccount(profile);
    }

    self.profile = profile;
    self.hidePasswordManager();
  };

  self.showPasswordManager = function() {
    self.passwordManager = true;
  };

  self.hidePasswordManager = function() {
    self.passwordManager = false;
  };

  self.validatePassword = function(password, rePassword) {
    if (Auth.account.type == 1 || !self.userId) {
      if (self.profile.newPassword && !self.profile.password) {
        displayResponse(false, "You have to enter your current password.", self);
        return false;
      }
    }

    if (self.profile.newPassword && self.profile.newPassword != self.profile.reNewPassword) {
      displayResponse(false, "New passwords are not the same.", self);
      return false;
    }

    return true;
  };
}];
