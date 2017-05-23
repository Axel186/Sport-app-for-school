'use strict';

module.exports = {
  controller: [function() {
    var self = this;
    self.handleLoadPage = function(num) {
      self.onLoadPage({
        value: num
      });
    }
  }],
  template: require('./template.pug'),
  bindings: {
    currentPage: "=",
    pages: "<",
    onLoadPage: "&"
  }
};
