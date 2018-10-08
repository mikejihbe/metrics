'use strict';
var ScheduledReporter = require('./scheduled-reporter.js'),
  Histogram = require('../metrics').Histogram,
  util = require('util'),
  fs = require('fs'),
  noop = function () {};

/**
 * A custom reporter that will create a csv file for each metric that is appended to on the defined reporting interval.
 * @param {Report} registry report instance whose metrics to report on.
 * @param {String} directory Directory to put csv files in.
 * @constructor
 */
function CsvReporter(registry, directory) {
  CsvReporter.super_.call(this, registry);
  this.directory = directory;
}

util.inherits(CsvReporter, ScheduledReporter);

CsvReporter.prototype.report = function() {
  var metrics = this.getMetrics();
  var self = this;

  var timestamp = (new Date).getTime() / 1000;

  metrics.counters.forEach(function(counter) {
    self.reportCounter.bind(self)(counter, timestamp);
  });

  metrics.meters.forEach(function(meter) {
    self.reportMeter.bind(self)(meter, timestamp);
  });

  metrics.timers.forEach(function(timer) {
    // Don't log timer if its recorded no metrics.
    if(timer.min() != null) {
      self.reportTimer.bind(self)(timer, timestamp);
    }
  });

  metrics.histograms.forEach(function(histogram) {
    // Don't log histogram if its recorded no metrics.
    if(histogram.min != null) {
      self.reportHistogram.bind(self)(histogram, timestamp);
    }
  });

  metrics.gauges.forEach(function(gauge) {
    self.reportGauge.bind(self)(gauge, timestamp);
  });
};

CsvReporter.prototype.write = function(timestamp, name, header, line, values) {
  var file = util.format('%s/%s.csv', this.directory, name);
  // copy params and add line to the beginning and pass as arguments to util.format
  // this operates like a quasi 'vsprintf'.
  var params = values.slice();
  params.unshift(line + "\n");
  var data = util.format.apply(util, params);
  data = util.format('%d,%s', timestamp, data);
  fs.exists(file, function(exists) {
    if(!exists) {
      // include header if file didn't previously exist
      data = util.format("t,%s\n%s", header, data);
    }
    fs.appendFile(file, data, {}, noop);
  });
};

CsvReporter.prototype.reportCounter = function(counter, timestamp) {
  var write = this.write.bind(this);

  write(timestamp, counter.name, 'count', '%d', [counter.count]);
};

CsvReporter.prototype.reportMeter = function(meter, timestamp) {
  var write = this.write.bind(this);

  write(timestamp, meter.name,
    'count,mean_rate,m1_rate,m5_rate,m15_rate,rate_unit',
    '%d,%d,%d,%d,%d,events/%s', [
      meter.count,
      meter.meanRate(),
      meter.oneMinuteRate(),
      meter.fiveMinuteRate(),
      meter.fifteenMinuteRate(),
      'second'
    ]
  );
};

CsvReporter.prototype.reportTimer = function(timer, timestamp) {
  var write = this.write.bind(this);
  var percentiles = timer.percentiles([.50,.75,.95,.98,.99,.999]);

  write(timestamp, timer.name,
    'count,max,mean,min,stddev,p50,p75,p95,p98,p99,p999,mean_rate,m1_rate,' +
    'm5_rate,m15_rate,rate_unit,duration_unit',
    '%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,calls/%s,%s', [
      timer.count(),
      timer.max(),
      timer.mean(),
      timer.min(),
      timer.stdDev(),
      percentiles[.50],
      percentiles[.75],
      percentiles[.95],
      percentiles[.98],
      percentiles[.99],
      percentiles[.999],
      timer.meanRate(),
      timer.oneMinuteRate(),
      timer.fiveMinuteRate(),
      timer.fifteenMinuteRate(),
      'second',
      'millisecond'
    ]);
};

CsvReporter.prototype.reportHistogram = function(histogram, timestamp) {
  var write = this.write.bind(this);
  var percentiles = histogram.percentiles([.50,.75,.95,.98,.99,.999]);

  write(timestamp, histogram.name,
    'count,max,mean,min,stddev,p50,p75,p95,p98,p99,p999',
    '%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d', [
      histogram.count,
      histogram.max,
      histogram.mean(),
      histogram.min,
      histogram.stdDev(),
      percentiles[.50],
      percentiles[.75],
      percentiles[.95],
      percentiles[.98],
      percentiles[.99],
      percentiles[.999]
    ]);
};

CsvReporter.prototype.reportGauge = function(gauge, timestamp) {
  var write = this.write.bind(this);
  write(timestamp, gauge.name, 'value', '%s', [JSON.stringify(gauge.value())]);
}

module.exports = CsvReporter;
