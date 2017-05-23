'use strict';

var config = require("../../config");

var user = config.regular_user;

var token;
var record_id = config.regular_user2.record_id;

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

  // Permissions checks
  it('Cant Create new record - regular user to RegularUserTwo', function(done) {
    chai.request(app)
      .post('/api/records')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:40:00",
        "date": "2017-04-11T17:17:43.816Z",
        "distance": 8000,
        "userId": config.regular_user2.uuid
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

  it('Cant Update record - regular user to RegularUserTwo', function(done) {
    chai.request(app)
      .patch('/api/records/' + record_id)
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

  it('Cant Delete record - regular user to RegularUserTwo', function(done) {
    chai.request(app)
      .delete('/api/records/?id=' + record_id)
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

  it('Cant Get list of records - regular user to RegularUserTwo', function(done) {
    chai.request(app)
      .get('/api/records?from=1489269600000&to=1491944340000&userId=' + config.regular_user2.uuid)
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

}
