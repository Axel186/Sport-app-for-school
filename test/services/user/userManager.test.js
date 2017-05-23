'use strict';

var config = require("../../config");

var randomstring = require("randomstring");
var string_uniq = randomstring.generate({
  length: 12,
  charset: 'alphabetic'
});

var user = config.user_manager;
var token;
var regular_user_id;

module.exports = function(chai, app) {
  it('User Manager Login', function(done) {
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

  it('Register new user', function(done) {
    user.name = "Test " + string_uniq;
    chai.request(app)
      .post('/api/users')
      // .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: string_uniq + "@" + string_uniq + ".com",
        password: string_uniq,
        name: string_uniq
      })
      .end((err, res) => {
        if (!res.body.uuid) {
          should.fail();
        }

        regular_user_id = res.body.uuid;
        done();
      });
  });

  it('Update Regular User profile', function(done) {
    chai.request(app)
      .patch('/api/users/' + regular_user_id)
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

  it('Update Regular User\'s password', function(done) {
    chai.request(app)
      .patch('/api/users/' + regular_user_id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        // password: string_uniq,
        newPassword: "new-password"
      })
      .end((err, res) => {
        if (!res.body.uuid) {
          should.fail();
        }

        done();
      });
  });

  it('Can\'t Update Admin profile', function(done) {
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

  it('Can\'t Update Admin\'s password', function(done) {
    chai.request(app)
      .patch('/api/users/' + config.admin.uuid)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        password: config.admin.password,
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

  it('User Manager DELETE Regular User profile', function(done) {
    chai.request(app)
      .delete('/api/users/?uuid=' + regular_user_id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        console.log("Removed:", res.body);
        if (!res.body[0].uuid) {
          should.fail();
        }

        done();
      });
  });
};
