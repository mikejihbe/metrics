var metrics = require('../../'),
  Report = metrics.Report,
  Counter = metrics.Counter,
  Timer = metrics.Timer,
  Meter = metrics.Meter,
  Histogram = metrics.Histogram,
  CachedGauge = metrics.CachedGauge,
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
  var hist = new Histogram();
  for (var i = 1; i <= 100; i++) {
    hist.update(i*2);
  }
  var gauge = new CachedGauge(function () {
    return 0.8
  }, 10000);
  var report = new Report();
  report.addMetric("basicCount", counter);
  report.addMetric("myapp.Meter", meter);
  report.addMetric("myapp.Timer", timer);
  report.addMetric("myapp.Histogram", hist);
  report.addMetric("myapp.Gauge", gauge);
  return report;
}

exports.getSampleReport = getSampleReport;
