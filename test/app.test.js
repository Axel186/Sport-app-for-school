'use strict';

var assert = require('assert');

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('request');
const app = require('../src/app');

chai.use(chaiHttp);
var should = chai.should();

var user = require("./services/user/index.test.js");
var record = require("./services/record/index.test.js");

describe('user service', function() {
  it('Start server', function(done) {
    this.server = app.listen(3030);
    this.server.once('listening', () => {
      done();
    });
  });

  user(chai, app);
  record(chai, app);
})
