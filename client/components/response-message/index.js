'use strict';

module.exports = {
  controller: require("./controller"),
  template: require('./template.pug'),
  bindings: {
    response: '<'
  }
};
