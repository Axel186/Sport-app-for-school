'use strict';

var config = require("../../config");

var randomstring = require("randomstring");
var string_uniq = randomstring.generate({
  length: 12,
  charset: 'alphabetic'
}) + "a";

var user = config.admin;

var token;
var user_id;
var record_id;

var title = "Admin to Regular";

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

  it('---Register new user', function(done) {
    user.name = "Test " + string_uniq;
    chai.request(app)
      .post('/api/users')
      // .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        email: string_uniq + "@" + string_uniq + ".com",
        password: string_uniq,
        name: string_uniq + " User"
      })
      .end((err, res) => {
        console.log("Registred:", res.body);
        if (!res.body.uuid) {
          should.fail();
        }

        user_id = res.body.uuid

        done();
      });
  });

  // Permissions checks
  it('Create new record - ' + title, function(done) {
    chai.request(app)
      .post('/api/records')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:40:00",
        "date": "2017-04-11T17:17:43.816Z",
        "distance": 8000,
        "userId": user_id
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

  it('Update record - ' + title, function(done) {
    chai.request(app)
      .patch('/api/records/' + record_id)
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:50:00",
        "distance": 8500
      })
      .end((err, res) => {
        if (!res.body.id) {
          should.fail();
        }

        done();
      });
  });

  it('Delete record - ' + title, function(done) {
    chai.request(app)
      .delete('/api/records/?id=' + record_id)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (!res.body.id) {
          should.fail();
        }

        done();
      });
  });

  // Permissions checks
  it('Create new record - ' + title, function(done) {
    chai.request(app)
      .post('/api/records')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "time": "00:40:00",
        "date": "2017-04-11T17:17:43.816Z",
        "distance": 8000,
        "userId": user_id
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


  it('Get list of records - ' + title, function(done) {
    chai.request(app)
      .get('/api/records?from=1489269600000&to=1491944340000&userId=' + user_id)
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

};
