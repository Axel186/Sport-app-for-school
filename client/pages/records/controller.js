'use strict';

const range = require('eustia-module/range');
const moment = require('moment');

var displayResponse = require("../../helpers/utils").displayResponse;

module.exports = ['Records', function(Records) {
  var self = this;

  self.records = [];
  self.currentPage = 0;

  this.$routerOnActivate = function(next) {
    if (next.params.userId) {
      self.userId = next.params.userId;
    }

    self.loadPage(self.currentPage);
  };

  self.loadPage = function(pageNum) {
    if (pageNum < 0) {
      return;
    }

    self.loading = true;

    var from = moment(self.filter.from).valueOf();
    var to = moment(self.filter.to).valueOf();

    Records.fetch(from, to, pageNum, self.userId)
      .then(function(res) {
        self.records = res.data.records;
        self.pages = range(0, res.data.pages, 1);

        if (res.data.pages <= pageNum) {
          self.loadPage(res.data.pages - 1);
        } else {
          self.currentPage = pageNum;
        }
      })
      .catch(function(err) {
        displayResponse(false, err.message, self);;
      })
      .then(function() {
        self.loading = false;
      });
  };

  self.handleRemoveRecord = function() {
    self.loadPage(self.currentPage);
  };

  self.activeFilterOptions = function() {
    self.showFilterOptions = true;
  };

  self.filterByLastMonth = function(ignoreLoadPage) {
    self.showFilterOptions = false;

    self.filter = {
      to: moment().startOf('day').add(23, 'hours').add(59, 'minutes')._d,
      from: moment().startOf('day').add(-30, 'days')._d
    }

    if (!ignoreLoadPage) {
      self.loadPage(0);
    }
  };

  self.handleRecordCreated = function() {
    self.loadPage(self.currentPage);
  };

  self.handleLoadPage = function(num) {
    self.loadPage(parseInt(num));
  };

  self.getUserId = function() {
    return self.userId;
  }

  self.filterByLastMonth(true);
}];
