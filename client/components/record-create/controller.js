'use strict';

const clone = require("eustia-module/clone");

const displayResponse = require("../../helpers/utils").displayResponse;
const prettyDisplay = require("../../helpers/prettyDisplay");

module.exports = ['$timeout', 'Records', function($timeout, Records) {
  var self = this;

  self.errors = {};
  self.record = {};

  self.$onInit = function() {
    self.resetForm();
  };

  self.submit = function() {
    if (self.record && self.record.id) {
      self.update();
    } else {
      self.create();
    }
  }

  self.update = function() {
    var error = self.validateTime(self.recordEdit.time);
    if (error) {
      displayResponse(false, error, self);
      return;
    }

    Records.update(self.recordEdit)
      .then(function(res) {
        self.loading = true;
        self.message = res.message;

        self.onUpdate({
          value: res.data
        });
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      })
      .then(function() {
        self.loading = false;
      });
  }

  self.create = function() {
    self.record = self.recordEdit;
    var error = self.validateTime(self.record.time);
    if (error) {
      displayResponse(false, error, self);
      return;
    }

    if (self.userId) {
      self.record.userId = self.userId;
    }

    Records.create(self.record)
      .then(function(res) {
        displayResponse(true, "Added succesfully", self);
        self.loading = true;

        self.record = {};
        self.resetForm();

        self.onCreate();
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);
      })
      .then(function() {
        self.loading = false;
      });
  }

  self.validateTime = function(time) {
    var errors = false;
    try {
      var arr = time.split(":").map(function(num, i) {
        num = parseInt(num);
        if (num != undefined && num >= 0) {
          return parseInt(num);
        } else {
          throw "Wrong time format.";
        }
      });

      if ((arr.length > 3) ||
        (arr[0] >= 24) ||
        (arr[1] >= 60) ||
        (arr[2] >= 60)
      ) {
        throw "Wrong time format.";
      }
    } catch (e) {
      return e;
    }

    return false;
  }

  self.stringToDate = function(date) {
    return new Date(date);
  }

  self.btnValue = function() {
    var value = "Add";

    if (self.record && self.record.id) {
      value = "Save";
    }

    return value;
  }

  self.resetForm = function() {
    if (self.record && self.record.date) {
      self.record.date = new Date(self.record.date);
      self.record.date = new Date(self.record.date);
    } else {
      self.record = {
        date: new Date()
      };
    }

    self.recordEdit = clone(self.record);
  }

}];
