'use strict';

var config = require("../config/default.json");

var domain = config.host;
if (config.port) {
  domain += ":" + config.port;
}

module.exports = {
  app: {
    name: "app"
  },
  api: {
    domain: domain,
    url: "http://" + domain + "/api/"
  },
  sitePages: [
    // "/",
    "/login",
    "/registration",
  ]
};
