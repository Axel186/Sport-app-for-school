'use strict';

var API_URL = require("../constants").api.url;
var Response = require("../helpers/response");
var utils = require("../helpers/utils");

module.exports = ['$http', 'Auth', function($http, Auth) {
  var self = this;

  const limit = 15;

  // self.records = [];

  self.fetch = function(from, to, page, userId) {
    var skip = page * limit;
    var url = API_URL + "records?from=" + from + "&to=" + to;
    if (skip) {
      url += "&$skip=" + skip
    }

    if (userId) {
      url += "&userId=" + userId
    }

    var message = "Something gone wrong...";
    return $http.get(url, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = {
            records: res.data.data,
            pages: Math.ceil(res.data.total / limit)
          };

          return new Response(true, "Records are successfully fetched.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError)
  }

  self.fetchDailyReport = function(from, to, userId) {
    var url = API_URL + "records-daily?from=" + from + "&to=" + to;

    if (userId) {
      url += "&userId=" + userId
    }

    var message = "Something gone wrong...";
    return $http.get(url, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {

          var data = {
            distance: [],
            time: []
          };

          Object.keys(res.data).forEach(function(day) {
            data.distance.push(res.data[day].distance);
            data.time.push(res.data[day].time);
          })

          return new Response(true, "Records are successfully fetched.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError)
  }

  self.remove = function(record) {
    var url = API_URL + "records?id=" + record.id;

    var message = "Something gone wrong...";
    return $http.delete(url, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = {
            records: record.id,
          };

          return new Response(true, "Record is successfully removed.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError)
  }

  self.create = function(record) {
    var request = {
      time: record.time,
      date: record.date,
      distance: record.distance
    };

    if (record.userId) {
      request.userId = record.userId;
    }

    var message = "Something gone wrong...";
    return $http.post(API_URL + "records", request, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = res.data;
          return new Response(true, "Record is successfully created.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError)
  }

  self.update = function(record) {
    var request = {
      time: record.time,
      date: record.date,
      distance: record.distance
    };

    var message = "Something gone wrong...";
    return $http.patch(API_URL + "records/" + record.id, request, Auth.getConfig())
      .then(function(res) {
        if (res.status == 200) {
          var data = res.data;
          return new Response(true, "Record is successfully updated.", data)
        } else {
          return new Response(false, message, res.data)
        }
      })
      .catch(utils.throwError)
  }

  return self;
}];
