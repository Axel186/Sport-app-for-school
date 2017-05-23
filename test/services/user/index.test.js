'use strict';

var config = require("../../config");

var adminTest = require("./admin.test");
var userManagerTest = require("./userManager.test");
var regularUserTest = require("./regularUser.test");

var randomstring = require("randomstring");

var string_uniq = randomstring.generate({
  length: 12,
  charset: 'alphabetic'
});
var token;

module.exports = function(chai, app) {
  var user = {
    email: string_uniq + "@" + string_uniq.substr(0, 4) + ".com",
    password: string_uniq
  };

  it('Fail login with unregistred user.', function(done) {
    chai.request(app)
      .post('/api/auth/local')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        console.log(res.body.message); // Invalid login.
        if (res.body.code != 401) {
          should.fail()
        }

        done();
      });
  });

  it('Register new user', function(done) {
    user.name = "Test " + string_uniq;
    chai.request(app)
      .post('/api/users')
      // .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(user)
      .end((err, res) => {
        console.log("Registred:", res.body);
        if (!res.body.uuid) {
          should.fail();
        }

        delete user.name;
        done();
      });
  });

  it('Login with new user', function(done) {
    chai.request(app)
      .post('/api/auth/local')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        console.log("Logged in:", res.body);
        if (!res.body.token) {
          should.fail();
        }

        token = res.body.token;
        done();
      });
  });

  it('Update profile', function(done) {
    chai.request(app)
      .patch('/api/users/')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: "New name" + string_uniq
      })
      .end((err, res) => {
        console.log("Name updated:", res.body);
        if (!res.body.uuid) {
          should.fail();
        }

        done();
      });
  });

  it('Update password', function(done) {
    chai.request(app)
      .patch('/api/users/')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        password: user.password,
        newPassword: "1" + user.password + "2"
      })
      .end((err, res) => {
        console.log("Password updated:", res.body);
        if (!res.body.uuid) {
          should.fail();
        }

        done();
      });
  });

  adminTest(chai, app);
  userManagerTest(chai, app);
  regularUserTest(chai, app);
};
