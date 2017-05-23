'use strict';

module.exports = {
  controller: ['Auth', function(Auth) {
    var self = this;

    if (Auth.account) {
      self.account = Auth.account;
    } else {
      Auth.checkPermissions()
        .then(function functionName() {
          self.account = Auth.account;
        });
    }
  }],
  template: require('./template.pug'),
  bindings: {
    activePage: "@",
  }
};
