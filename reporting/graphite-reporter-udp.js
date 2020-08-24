'use strict';
var dgram = require('dgram');

var ScheduledReporter = require('./scheduled-reporter.js'),
  Histogram = require('../metrics').Histogram,
  util = require('util');

/**
 * A custom reporter that sends metrics to a graphite server on the carbon tcp interface.
 * @param {Report} registry report instance whose metrics to report on.
 * @param {String} prefix A string to prefix on each metric (i.e. app.hostserver)
 * @param {String} host The ip or hostname of the target graphite server.
 * @param {String} port The port graphite is running on, defaults to 2003 if not specified.
 * @constructor
 */
function GraphiteReporter(registry, prefix, host, port) {
  GraphiteReporter.super_.call(this, registry);
  this.prefix = prefix;
  this.host = host;
  this.port = port || 2003;
}

util.inherits(GraphiteReporter, ScheduledReporter);

GraphiteReporter.prototype.start = function() {
  this.udpClient = dgram.createSocket('udp4');
};

GraphiteReporter.prototype.stop = function() {
  GraphiteReporter.super_.prototype.stop.call(this);
  this.udpClient.close();
};

GraphiteReporter.prototype.report = function() {
  var metrics = this.getMetrics();
  var self = this;
  var timestamp = Math.floor(Date.now() / 1000);

  if(metrics.counters.length != 0) {
    metrics.counters.forEach(function (count) {
      self.reportCounter.bind(self)(count, timestamp);
    })
  }

  if(metrics.meters.length != 0) {
    metrics.meters.forEach(function (meter) {
      self.reportMeter.bind(self)(meter, timestamp);
    })
  }

  if(metrics.timers.length != 0) {
    metrics.timers.forEach(function (timer) {
      // Don't log timer if its recorded no metrics.
      if(timer.min() != null) {
        self.reportTimer.bind(self)(timer, timestamp);
      }
    })
  }

  if(metrics.histograms.length != 0) {
    metrics.histograms.forEach(function (histogram) {
      // Don't log histogram if its recorded no metrics.
      if(histogram.min != null) {
        self.reportHistogram.bind(self)(histogram, timestamp);
      }
    })
  }

  if(metrics.gauges.length != 0) {
    metrics.gauges.forEach(function (gauge) {
      self.reportGauge.bind(self)(gauge, timestamp);
    })
  }
};

GraphiteReporter.prototype.send = function(name, value, timestamp) {
  const data = util.format('%s.%s %s %s\n', this.prefix, name, value, timestamp);
  this.udpClient.send(data, this.port, this.host, function(error){
    if(error){
      console.log('Error sending data: "%s"', data)
    } else{
      console.log('Data sent !!!');
    }
  });
};

GraphiteReporter.prototype.reportCounter = function(counter, timestamp) {
  var send = this.send.bind(this);

  send(counter.name, counter.count, timestamp);
};

GraphiteReporter.prototype.reportMeter = function(meter, timestamp) {
  var send = this.send.bind(this);

  send(util.format('%s.%s', meter.name, 'count'), meter.count, timestamp);
  send(util.format('%s.%s', meter.name, 'mean_rate'), meter.meanRate(), timestamp);
  send(util.format('%s.%s', meter.name, 'm1_rate'), meter.oneMinuteRate(),
    timestamp);
  send(util.format('%s.%s', meter.name, 'm5_rate'), meter.fiveMinuteRate(),
    timestamp);
  send(util.format('%s.%s', meter.name, 'm15_rate'), meter.fifteenMinuteRate(),
    timestamp);
};

GraphiteReporter.prototype.reportTimer = function(timer, timestamp) {
  var send = this.send.bind(this);
  send(util.format('%s.%s', timer.name, 'count'), timer.count(), timestamp);
  send(util.format('%s.%s', timer.name, 'mean_rate'), timer.meanRate(), timestamp);
  send(util.format('%s.%s', timer.name, 'm1_rate'), timer.oneMinuteRate(),
    timestamp);
  send(util.format('%s.%s', timer.name, 'm5_rate'), timer.fiveMinuteRate(),
    timestamp);
  send(util.format('%s.%s', timer.name, 'm15_rate'), timer.fifteenMinuteRate(),
    timestamp);

  this.reportHistogram(timer, timestamp);
};

GraphiteReporter.prototype.reportHistogram = function(histogram, timestamp) {
  var send = this.send.bind(this);

  var isHisto = Object.getPrototypeOf(histogram) === Histogram.prototype;
  if (isHisto) {
    // send count if a histogram, otherwise assume this metric is being
    // printed as part of another (like a timer).
    send(util.format('%s.%s', histogram.name, 'count'), histogram.count, timestamp);
  }

  var percentiles = histogram.percentiles([.50,.75,.95,.98,.99,.999]);
  send(util.format('%s.%s', histogram.name, 'min'), isHisto? histogram.min : histogram.min(), timestamp);
  send(util.format('%s.%s', histogram.name, 'mean'), histogram.mean(), timestamp);
  send(util.format('%s.%s', histogram.name, 'max'), isHisto ? histogram.max: histogram.max(), timestamp);
  send(util.format('%s.%s', histogram.name, 'stddev'), histogram.stdDev(), timestamp);
  send(util.format('%s.%s', histogram.name, 'p50'), percentiles[.50], timestamp);
  send(util.format('%s.%s', histogram.name, 'p75'), percentiles[.75], timestamp);
  send(util.format('%s.%s', histogram.name, 'p95'), percentiles[.95], timestamp);
  send(util.format('%s.%s', histogram.name, 'p98'), percentiles[.98], timestamp);
  send(util.format('%s.%s', histogram.name, 'p99'), percentiles[.99], timestamp);
  send(util.format('%s.%s', histogram.name, 'p999'), percentiles[.999], timestamp);
};

GraphiteReporter.prototype.reportGauge = function(gauge, timestamp) {
  var send = this.send.bind(this);
  send(util.format('%s.%s', gauge.name, 'value'), JSON.stringify(gauge.value()), timestamp);
};

module.exports = GraphiteReporter;
