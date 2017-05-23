'use strict';

const service = require('feathers-sequelize');
const record = require('../record/record-model');
const auth = require('feathers-authentication').hooks;

const range = require("moment-range");
const moment = range.extendMoment(require("moment"));
const errors = require('feathers-errors');

module.exports = function() {
  const app = this;

  const options = {
    Model: record(app.get('sequelize')),
  };

  // Initialize our service with any options it requires
  app.use('/api/records-daily', service(options));
  const recordService = app.service('/api/records-daily');

  recordService.before({
    all: [
      auth.verifyToken(),
      auth.populateUser(),
      auth.restrictToAuthenticated()
    ],
    find: [
      function(hook, cb) {
        var recordService = app.service('/api/records');

        hook.params.query.userId = hook.params.user.uuid;
        hook.params.user.req = {
          from: new Date(parseInt(hook.params.query.from)),
          to: new Date(parseInt(hook.params.query.to))
        };

        recordService.find({
            query: hook.params.query,
            user: hook.params.user
          })
          .then(() => cb(null, hook))
          .catch((err) => cb(err, hook));
      }
    ]
  });

  recordService.after({
    find(hook, next) {
      var records_by_dates = organizeItemsByDates(hook.result);

      var dates = range_by_days(hook.params.user.req.from, hook.params.user.req.to);
      var results = {};

      dates.forEach(function(date) {
        var distance = 0;
        var time = twoDigits(0);

        if (records_by_dates[date] && records_by_dates[date].length) {
          time = parseInt(time);

          records_by_dates[date].forEach(function(record) {
            var hours = parseInt(moment(record.time, "HH:mm:ss").format("H"));
            var minutes = parseInt(moment(record.time, "HH:mm:ss").format("m"));
            var seconds = parseInt(moment(record.time, "HH:mm:ss").format("s"));

            distance += record.distance;
            time += hours * 60 * 60 + minutes * 60 + seconds;
          });

          distance = distance / records_by_dates[date].length;
          time = time / records_by_dates[date].length;
        }

        results[date] = {
          distance: distance,
          time: convertTime(time)
        }
      });

      hook.result = results;

      next();
    },
  });
};

function twoDigits(num) {
  if (num < 10) {
    num = "0" + num;
  }

  return num;
}

function range_by_days(from, to) {
  var dates = [];

  const range = moment.range(from, to);
  for (let day of range.by('day')) {
    var date = day.format('DD.MM.YYYY');
    dates.push(date);
  }

  return dates;
}

function organizeItemsByDates(records) {
  var records_by_dates = {};

  records.forEach(function(record) {
    var key = moment(record.date).format("DD.MM.YYYY");
    records_by_dates[key] = records_by_dates[key] || [];

    records_by_dates[key].push(record);
  })

  return records_by_dates;
}

var convertTime = function(input, separator) {
  var pad = function(input) {
    return input < 10 ? "0" + input : input;
  };
  return [
    pad(Math.floor(input / 3600)),
    pad(Math.floor(input % 3600 / 60)),
    pad(Math.floor(input % 60)),
  ].join(typeof separator !== 'undefined' ? separator : ':');
}
