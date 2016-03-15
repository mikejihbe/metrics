var Report = require('../').Report,
  Counter = require('../').Counter,
  Timer = require('../').Timer,
  Meter = require('../').Meter,
  util = require('util');

function getSampleReport() {
  var counter = new Counter();
  counter.inc(5);
  var timer = new Timer();
  for (var i = 1; i <= 100; i++) {
    timer.update(i);
  }
  var meter = new Meter();
  meter.mark(10);
  var report = new Report();
  report.addMetric("basicCount", counter);
  report.addMetric("myapp.Meter", meter);
  report.addMetric("myapp.Timer", timer);
  return report;
}

exports.getSampleReport = getSampleReport;
