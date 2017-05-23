'use strict';

const range = require('eustia-module/range');
const moment = require("moment");
const utils = require("../../helpers/utils");
const prettyDisplay = require("../../helpers/prettyDisplay");

module.exports = ['Auth', 'Records', function(Auth, Records) {
  var self = this;
  self.prettyDisplay = prettyDisplay;

  self.labels = calculateWeekDays();
  self.series = ['Distance', 'Average Speed'];

  var today = moment().startOf('day').add(23, 'hours').add(59, 'minutes').valueOf();
  var sevenDaysBack = moment().startOf('day').add(-6, 'days').valueOf();

  Records.fetchDailyReport(sevenDaysBack, today)
    .then(function(res) {
      self.results = res.data;
      self.results.speed = res.data.time.map(function(time, i) {
        return utils.calculateSpeed(self.results.distance[i], time);
      })

      self.data = [self.results.distance, self.results.speed];
      self.avg = {
        distance: calculateAverage(self.results.distance),
        speed: calculateAverage(self.results.speed)
      };
    });

  self.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

  self.datasetOverride = [{
    label: self.series[0],
    borderWidth: 1,
    type: 'bar',
    yAxisID: 'y-axis-1',
    ticks: {
      min: 0,
    }
  }, {
    label: self.series[1],
    borderWidth: 3,
    hoverBackgroundColor: "rgba(255,99,132,0.4)",
    hoverBorderColor: "rgba(255,99,132,1)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    type: 'line',
    yAxisID: 'y-axis-2',
    ticks: {
      min: 0
    }
  }];

  self.options = {
    tooltips: {
      callbacks: {
        label: function(tooltipItems, data) {
          var value = prettyDisplay.distance(tooltipItems.yLabel);

          if (data.datasets[tooltipItems.datasetIndex].yAxisID == 'y-axis-2') {
            value = prettyDisplay.speed(tooltipItems.yLabel);
          }

          return data.datasets[tooltipItems.datasetIndex].label + ': ' + value;
        }
      }
    },
    scales: {
      yAxes: [{
        id: 'y-axis-1',
        position: 'left',
        ticks: {
          min: 0,
          callback: function(value) {
            var metric = "km"
            return prettyDisplay.distance(value)
          }
        },

      }, {
        id: 'y-axis-2',
        position: 'right',
        ticks: {
          min: 0,
          callback: function(value) {
            return prettyDisplay.speed(value)
          }
        },
      }]
    }
  };
}];

function calculateAverage(arr) {
  var total = 0;

  for (var i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  return total / arr.length;
}

function calculateWeekDays() {
  var dateNow = Date.now();

  var days = range(0, 7).reverse().map(function(i) {
    return moment(dateNow - i * 60 * 60 * 24 * 1000).format("DD.MM");
  });

  return days;
}
