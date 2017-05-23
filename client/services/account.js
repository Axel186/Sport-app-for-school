'use strict';

var API_URL = require("../constants").api.url;
var Response = require("../helpers/response");
var utils = require("../helpers/utils");

module.exports = ['$http', 'Auth', function($http, Auth) {
  var self = this;

  self.profile = {};

  self.setProfile = function(profile) {
    self.profile = profile;
  }

  self.getProfile = function(userId) {
    userId = (userId) ? userId : "mine";

    var message = "Something gone wrong...";
    return $http.get(API_URL + "users/" + userId, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = res.data;
          // self.setProfile(data);

          return new Response(true, "Profile successfully fetched.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError);
  }

  self.updateProfile = function(profile) {
    var request = {
      name: profile.name,
      type: profile.type
    };

    if (profile.password) {
      request.password = profile.password;
    }

    if (profile.newPassword) {
      request.newPassword = profile.newPassword;
    }

    var message = "Something gone wrong...";
    return $http.patch(API_URL + "users/" + profile.uuid, request, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = res.data;
          // self.setProfile(data);

          return new Response(true, "Profile is successfully updated.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError);
  }

  return self;
}];
