'use strict';

var API_URL = require("../constants").api.url;
var Response = require("../helpers/response");
var utils = require("../helpers/utils");

module.exports = ['$http', 'Auth', function($http, Auth) {
  var self = this;

  const limit = 15;

  self.fetch = function(page) {
    var message = "Something gone wrong...";

    var skip = page * limit;
    var url = API_URL + "users?";
    if (skip) {
      url += "$skip=" + skip
    }

    return $http.get(url, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = {
            users: res.data.data,
            pages: Math.ceil(res.data.total / limit)
          };

          return new Response(true, "Users are successfully fetched.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError);
  }

  self.remove = function(user) {
    var url = API_URL + "users?uuid=" + user.uuid;

    var message = "Something gone wrong...";
    return $http.delete(url, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          return new Response(true, "User is successfully removed.")
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError);
  }

  return self;
}];
