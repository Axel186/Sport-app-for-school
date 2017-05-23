'use strict';

var range = require('eustia-module/range');
var displayResponse = require("../../helpers/utils").displayResponse;

module.exports = ['$timeout', '$location', 'Users', 'Auth', function($timeout, $location, Users, Auth) {
  var self = this;

  // Check access to this page
  Auth.getAccount()
    .then(function(account) {
      $timeout(function() {
        if (account.type == "1") {
          $location.path("/");
        }

        self.account = account;
      }, 100)
    })

  self.users = [];
  self.currentPage = 0;

  self.handleLoadPage = function(num) {
    self.loadPage(parseInt(num));
  };

  self.loadPage = function(pageNum) {
    self.loading = true;

    Users.fetch(pageNum)
      .then(function(res) {
        self.users = res.data.users;
        self.pages = range(0, res.data.pages, 1);

        if (res.data.pages <= pageNum) {
          self.loadPage(res.data.pages - 1);
        } else {
          self.currentPage = pageNum;
        }
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      })
      .then(function() {
        self.loading = false;
      });
  }

  self.removeUser = function(user) {
    var confirm = window.confirm("Are you sure? To delete user '" + user.name + "'?");

    if (!confirm) {
      return;
    }

    Users.remove(user)
      .then(function(res) {
        displayResponse(res.status, res.message, self);
        self.handleRemoveRecord();
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      })
      .then(function() {
        self.loading = false;
      });
  }

  self.handleRemoveRecord = function() {
    self.loadPage(self.currentPage);
  };

  self.goTo = function(url) {
    $location.path(url);
  }

  self.loadPage(self.currentPage);
}];
