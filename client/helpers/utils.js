"use strict";

const moment = require("moment");
const Response = require("./response");

module.exports = {
  displayResponse: function(success, message, self) {
    self.response = self.response || {};
    self.response.status = success;

    if (success) {
      self.response.type = "success";
    } else {
      self.response.type = "danger";
    }

    self.response.message = message;
  },
  calculateSpeed: function(distance, time) {
    var hours = parseInt(moment(time, "HH:mm:ss").format("H"));
    var minutes = parseInt(moment(time, "HH:mm:ss").format("m"));

    var totalTime = (hours * 60 + minutes) / 60;

    var speed = 0;
    if (totalTime) {
      speed = distance / totalTime;
    }

    return speed;
  },
  throwError: function(err) {
    var message;
    if (!err.data) {
      throw new Response(false, err.message || "Service is down. Please try later.");
    }

    if (err.data.message) {
      message = err.data.message;
    }

    throw new Response(false, message);
  }
}
