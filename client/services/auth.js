'use strict';

const API_URL = require("../constants").api.url;
const Response = require("../helpers/response");
const cookies = require("../helpers/cookies");

module.exports = ['$http', '$location', '$timeout', function($http, $location, $timeout) {
  var self = this;

  self.registration = function(name, email, password) {
    var request = {
      "name": name,
      "email": email,
      "password": password
    };

    var message = "Something gone wrong...";

    return $http.post(API_URL + "users", request)
      .then(function(res) {
        if (res.status == 201) {
          return new Response(true, "You have successfully registered!");
        } else {
          throw new Error(message);
        }
      })
      .catch(function(err) {
        if (!err.data) {
          return new Response(false, err.message || "Service is down. Please try later.");
        }

        if (err.data.errors.length) {
          if (err.data.errors[0].type == "unique violation") {
            message = "Email address already in use, please try to enter other Email."
          }
        } else {
          if (err.data.message) {
            message = err.data.message;
          }
        }

        return new Response(false, message);
      });
  }

  self.login = function(email, password) {
    var request = {
      "email": email,
      "password": password
    };

    var message = "Something gone wrong...";

    return $http.post(API_URL + "auth/local", request)
      .then(function(res) {
        if (res.status == 201) {
          cookies.set("token", res.data.token, 1);
          self.setAccount(res.data.data);

          return new Response(true, "You have successfully logged in!");
        } else {
          throw new Error(message);
        }
      })
      .catch(function(err) {
        if (!err.data) {
          return new Response(false, err.message || "Service is down. Please try later.");
        }

        if (err.data.message) {
          message = err.data.message;
        }

        if (err.data.code == 401) {
          message = "Wrong email or password."
        }

        return new Response(false, message);
      });
  }

  // Prepare OPTIONS - Access request parameter
  self.getConfig = function() {
    var token = cookies.get("token");

    var config = {
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    };

    return config;
  }

  self.setAccount = function(profile) {
    profile.type = profile.type;
    self.account = profile;
  }

  self.getAccount = function() {
    return new Promise(function(resolve, reject) {
      $timeout(function() {
        resolve(self.account);
      }, 100);
    });
  }

  self.checkPermissions = function() {
    if ($location.path() != "/login" || $location.path() != "/registration") {

      return $http.get(API_URL + "users/mine", self.getConfig())
        .then(function(res) {
          if (res.status == 200) {
            self.setAccount(res.data);
          } else {
            console.error(res.status);
          }
        })
        .catch(function(err) {
          if (err.status == 401) {
            self.logOut();
          }

          console.error(err);
        });
    }
  }

  self.logOut = function() {
    cookies.delete("token");
    $location.path("/login");
  }

  // self.checkPermissions()

  return self;
}];
