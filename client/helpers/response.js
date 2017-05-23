'use strict';

var capitalize = require('eustia-module/capitalize');

function Response(status, message, data) {
  this.status = status || false;
  this.message = capitalize(message) || "";
  this.data = data || {};
}

Response.prototype.success = function(message, data) {
  if (typeof message === "undefined") {
    throw new Error("Response - message variable is requirement!");
  }

  this.status = true;
  this.message = capitalize(message);

  if (typeof data !== "undefined") {
    this.data = data;
  }
};

Response.prototype.fail = function(message) {
  if (typeof message === "undefined") {
    throw new Error("Response - message variable is requirement!");
  }

  this.status = false;
  this.message = capitalize(message);
};

module.exports = Response;
