'use strict';

var config = require("../../config");

var randomstring = require("randomstring");
var string_uniq = randomstring.generate({
  length: 12,
  charset: 'alphabetic'
});

var user = config.regular_user;
var token;

module.exports = function(chai, app) {
  it('Regular User Login', function(done) {
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

  it('Regular User Update other Regular User profile', function(done) {
    chai.request(app)
      .patch('/api/users/' + config.regular_user2.uuid)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: "New name" + string_uniq
      })
      .end((err, res) => {
        console.log("Name updated:", res.body);
        if (res.body.uuid) {
          console.log("------", res.body.uuid, "------");
          should.fail();
        }

        done();
      });
  });

  it('Regular User Can\'t Update User Manager profile', function(done) {
    chai.request(app)
      .patch('/api/users/' + config.user_manager.uuid)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: "New name" + string_uniq
      })
      .end((err, res) => {
        if (res.body.code != 403) {
          should.fail();
        } else {
          // console.log("New record created:", res.body);
        }

        done();
      });
  });

  it('Regular User Can\'t Update Admin profile', function(done) {
    chai.request(app)
      .patch('/api/users/' + config.admin.uuid)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: "New name" + string_uniq
      })
      .end((err, res) => {
        if (res.body.code != 403) {
          should.fail();
        } else {
          // console.log("New record created:", res.body);
        }


        done();
      });
  });

  it('Cant Update Regular User\'s password', function(done) {
    chai.request(app)
      .patch('/api/users/' + config.regular_user2.uuid)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        // password: string_uniq,
        newPassword: "new-password"
      })
      .end((err, res) => {
        if (res.body.code != 403) {
          should.fail();
        } else {
          // console.log("New record created:", res.body);
        }

        done();
      });
  });

};
