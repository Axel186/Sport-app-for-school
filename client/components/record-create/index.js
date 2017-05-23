'use strict';

require("./style.styl");

module.exports = {
  template: require('./template.pug'),
  controller: require('./controller'),
  bindings: {
    record: '<',
    userId: '<',
    onUpdate: '&',
    onCreate: '&'
  }
};
