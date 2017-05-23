'use strict';

const moment = require("moment");
const prettyDisplay = require("../../helpers/prettyDisplay");
const displayResponse = require("../../helpers/utils").displayResponse;

const utils = require("../../helpers/utils");

module.exports = ['$timeout', '$http', 'Records', function($timeout, $http, Records) {
  var self = this;
  self.prettyDisplay = prettyDisplay;

  self.$onInit = function() {
    self.record.speed = utils.calculateSpeed(self.record.distance, self.record.time);
  };

  self.mode = "info";

  self.activeEditMode = function() {
    self.mode = "edit";
  }

  self.activeInfoMode = function() {
    self.mode = "info";
  }

  self.handleUpdate = function(record) {
    self.record = record;
    self.record.speed = utils.calculateSpeed(self.record.distance, self.record.time);
    self.activeInfoMode();
  }

  self.removeRecord = function(record) {
    var confirm = window.confirm("Are you sure? To delete record " + record.date + "?");

    if (!confirm) {
      return;
    }

    Records.remove(record)
      .then(function(res) {
        // self.message = res.message;
        self.onRemove();
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      })
      .then(function() {
        self.loading = false;
      });
  }
}];
