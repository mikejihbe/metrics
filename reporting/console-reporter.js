'use strict';
var ScheduledReporter = require('./scheduled-reporter.js'),
  util = require('util');

/**
 * A custom reporter that prints all metrics on console.log at a defined interval.
 * @param {Report} registry report instance whose metrics to report on.
 * @constructor
 */
function ConsoleReporter(registry) {
  ConsoleReporter.super_.call(this, registry);
}

util.inherits(ConsoleReporter, ScheduledReporter);

ConsoleReporter.prototype.report = function() {
  var metrics = this.getMetrics();

  if(metrics.counters.length != 0) {
    printWithBanner('Counters');
    metrics.counters.forEach(function (counter) {
      printCounter(counter);
    });
    console.log();
  }

  if(metrics.meters.length != 0) {
    printWithBanner('Meters');
    metrics.meters.forEach(function (meter) {
      printMeter(meter);
    });
    console.log();
  }

  if(metrics.timers.length != 0) {
    printWithBanner('Timers');
    metrics.timers.forEach(function (timer) {
      // Don't log timer if its recorded no metrics.
      if(timer.min() != null) {
        printTimer(timer);
      }
    });
    console.log();
  }
};

function printWithBanner(name) {
  var dashLength = 80 - name.length - 1;
  var dashes = "";
  for(var i = 0; i < dashLength; i++) {
    dashes += '-';
  }
  console.log('%s %s', name, dashes);
}

function ff(value) {
  var fixed = value.toFixed(2);
  return fixed >= 10 || fixed < 0 ? fixed : " " + fixed;
}

function printCounter(counter) {
  console.log(counter.name);
  console.log('             count = %d', counter.count);
}

function printMeter(meter) {
  console.log(meter.name);
  console.log('             count = %d', meter.count);
  console.log('         mean rate = %s events/%s', ff(meter.meanRate()), 'second');
  console.log('     1-minute rate = %s events/%s', ff(meter.oneMinuteRate()), 'second');
  console.log('     5-minute rate = %s events/%s', ff(meter.fiveMinuteRate()), 'second');
  console.log('    15-minute rate = %s events/%s', ff(meter.fifteenMinuteRate()), 'second');
}

function printTimer(timer) {
  console.log(timer.name);
  console.log('             count = %d', timer.count());
  console.log('         mean rate = %s events/%s', ff(timer.meanRate()), 'second');
  console.log('     1-minute rate = %s events/%s', ff(timer.oneMinuteRate()), 'second');
  console.log('     5-minute rate = %s events/%s', ff(timer.fiveMinuteRate()), 'second');
  console.log('    15-minute rate = %s events/%s', ff(timer.fifteenMinuteRate()), 'second');

  var percentiles = timer.percentiles([.50,.75,.95,.98,.99,.999]);

  console.log('               min = %s %s', ff(timer.min()), 'milliseconds');
  console.log('               max = %s %s', ff(timer.max()), 'milliseconds');
  console.log('              mean = %s %s', ff(timer.mean()), 'milliseconds');
  console.log('            stddev = %s %s', ff(timer.stdDev()), 'milliseconds');
  console.log('              50%% <= %s %s', ff(percentiles[.50]), 'milliseconds');
  console.log('              75%% <= %s %s', ff(percentiles[.75]), 'milliseconds');
  console.log('              95%% <= %s %s', ff(percentiles[.95]), 'milliseconds');
  console.log('              98%% <= %s %s', ff(percentiles[.98]), 'milliseconds');
  console.log('              99%% <= %s %s', ff(percentiles[.99]), 'milliseconds');
  console.log('            99.9%% <= %s %s', ff(percentiles[.999]), 'milliseconds');
}

module.exports = ConsoleReporter;

