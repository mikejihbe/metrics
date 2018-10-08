'use strict';
var ScheduledReporter = require('./scheduled-reporter.js'),
  Histogram = require('../metrics').Histogram,
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

  if(metrics.histograms.length != 0) {
    printWithBanner('Histograms');
    metrics.histograms.forEach(function (histogram) {
      // Don't log histogram if its recorded no metrics.
      if(histogram.min != null) {
        printHistogram(histogram);
      }
    });
    console.log();
  }

  if(metrics.gauges.length != 0) {
    printWithBanner('Gauges');
    metrics.gauges.forEach(function (gauge) {
      printGauge(gauge);
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

  printHistogram(timer);
}

function printHistogram(histogram) {
  var isHisto = Object.getPrototypeOf(histogram) === Histogram.prototype;
  if(isHisto) {
    // log name and count if a histogram, otherwise assume this metric is being
    // printed as part of another (like a timer).
    console.log(histogram.name);
    console.log('             count = %d', histogram.count);
  }

  var percentiles = histogram.percentiles([.50,.75,.95,.98,.99,.999]);
  // assume timer if not a histogram, in which case we include durations.
  var durationUnit = isHisto ? '' : ' milliseconds';

  console.log('               min = %s%s', ff(isHisto ? histogram.min : histogram.min()), durationUnit);
  console.log('               max = %s%s', ff(isHisto ? histogram.max : histogram.max()), durationUnit);
  console.log('              mean = %s%s', ff(histogram.mean()), durationUnit);
  console.log('            stddev = %s%s', ff(histogram.stdDev()), durationUnit);
  console.log('              50%% <= %s%s', ff(percentiles[.50]), durationUnit);
  console.log('              75%% <= %s%s', ff(percentiles[.75]), durationUnit);
  console.log('              95%% <= %s%s', ff(percentiles[.95]), durationUnit);
  console.log('              98%% <= %s%s', ff(percentiles[.98]), durationUnit);
  console.log('              99%% <= %s%s', ff(percentiles[.99]), durationUnit);
  console.log('            99.9%% <= %s%s', ff(percentiles[.999]), durationUnit);
}

function printGauge(gauge) {
  console.log(gauge.name);
  console.log('             value = %s', JSON.stringify(gauge.value()));
}

module.exports = ConsoleReporter;

