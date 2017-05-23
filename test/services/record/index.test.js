'use strict';

var config = require("../../config");

var regularToRegular = require("./regular-regular.test");
var regularToUserManager = require("./regular-userManager.test");

var userManagerToRegular = require("./userManager-regular.test");
var userManagerToAdmin = require("./userManager-admin.test");

var adminToRegular = require("./admin-regular.test");
var adminToUserManager = require("./admin-userManager.test");

var user = config.regular_user;

var token;
var record_id;

module.exports = function(chai, app) {
  it('Login with Regular User', function(done) {
    chai.request(app)
      .post('/api/auth/local')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        // console.log("Logged in:", res.body);
        if (!res.body.token) {
          should.fail();
        }

        token = res.body.token;
        console.log(token);
        done();
      });
  });

  it('Create new record', function(done) {
    chai.request(app)
      .post('/api/records')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:40:00",
        "date": "2017-04-11T17:17:43.816Z",
        "distance": 8000
      })
      .end((err, res) => {
        // console.log("New record created:", res.body);
        if (!res.body.id) {
          should.fail();
        }

        record_id = res.body.id;
        done();
      });
  });

  it('Get list of records', function(done) {
    chai.request(app)
      .get('/api/records?from=1489269600000&to=1491944340000')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(user)
      .end((err, res) => {
        if (!res.body.total) {
          should.fail();
        }

        done();
      });
  });

  it('Edit record', function(done) {
    chai.request(app)
      .patch('/api/records/' + record_id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:50:00",
        "distance": 8500
      })
      .end((err, res) => {
        // console.log("Record updated:", res.body);
        if (!res.body.id) {
          should.fail();
        }

        done();
      });
  });

  it('Delete record', function(done) {
    chai.request(app)
      .delete('/api/records/?id=' + record_id)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        // console.log("Record removed:", res.body);
        if (!res.body.id) {
          should.fail();
        }

        done();
      });
  });


  // Permissions checks
  var record_id_admin = config.admin.record_id;
  it('Cant Create new record - regular user to Admin', function(done) {
    chai.request(app)
      .post('/api/records')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:40:00",
        "date": "2017-04-11T17:17:43.816Z",
        "distance": 8000,
        "userId": "9127c71d-602b-443d-901f-07d4db67f778"
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

  it('Cant Update record - regular user to Admin', function(done) {
    chai.request(app)
      .patch('/api/records/' + record_id_admin)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:50:00",
        "distance": 8500
      })
      .end((err, res) => {
        if (res.body.code != 403) {
          should.fail();
        } else {
          // console.log("Record updated:", res.body);
        }

        done();
      });
  });

  it('Cant Delete record - regular user to Admin', function(done) {
    chai.request(app)
      .delete('/api/records/?id=' + record_id_admin)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (res.body.code != 403) {
          should.fail();
        } else {
          // console.log("Record updated:", res.body);
        }

        done();
      });
  });

  it('Cant Get list of records - regular user to Admin', function(done) {
    chai.request(app)
      .get('/api/records?from=1489269600000&to=1491944340000&userId=9127c71d-602b-443d-901f-07d4db67f778')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(user)
      .end((err, res) => {
        if (res.body.code != 403) {
          should.fail();
        } else {
          // console.log("Record updated:", res.body);
        }

        done();
      });
  });

  regularToRegular(chai, app);
  regularToUserManager(chai, app);
  userManagerToRegular(chai, app);
  userManagerToAdmin(chai, app);
  adminToRegular(chai, app);
  adminToUserManager(chai, app);
};
