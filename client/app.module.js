'use strict';

var constants = require("./constants");

module.exports = angular.module(constants.app.name, [
  'ngSanitize',
  'ngComponentRouter',
  'chart.js'
]);
