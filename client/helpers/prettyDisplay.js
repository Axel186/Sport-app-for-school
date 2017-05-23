"use strict";

const moment = require("moment");
const numeral = require("numeral");

module.exports = {
  distance: function(distance) {
    var metric = "meters";
    var value = distance;

    if (distance > 1000 & distance % 100 == 0) {
      metric = "km";
      value = value / 1000;
    }

    return numeral(value).format('0.[0]') + " " + metric;
  },
  speed: function(distance) {
    var metric = "m/h";
    var value = distance;

    if (distance > 1000) {
      metric = "km/h";
      value = value / 1000;
    }

    return numeral(value).format('0.[0]') + " " + metric;
  },
  date: function(date) {
    return moment(date).format("MMMM Do, YYYY")
  },
  time: function(time) {
    if (!time) {
      return "00:00";
    }

    var arr = time.split(":");
    if (!parseInt(arr[2])) {
      var secs = arr.pop();
    }
    return arr.join(":");
  }
}
