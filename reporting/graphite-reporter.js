'use strict';
var ScheduledReporter = require('./scheduled-reporter.js'),
  util = require('util'),
  Socket = require('net').Socket;

var reconnecting = false;

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

GraphiteReporter.prototype.start = function(intervalInMs) {
  var self = this;
  this.socket = new Socket();
  this.socket.on('error', function(exc) {
    if(!reconnecting) {
      reconnecting = true;
      self.emit('log', 'warn', util.format('Lost connection to %s. Will reconnect in 10 seconds.', self.host), exc);
      // Stop the reporter and try again in 1 second.
      self.stop();
      setTimeout(function () {
        reconnecting = false;
        self.start(intervalInMs);
      }, 10000);
    }
  });

  self.emit('log', 'verbose', util.format("Connecting to graphite @ %s:%d", this.host, this.port));
  this.socket.connect(this.port, this.host, function() {
    self.emit('log', 'verbose', util.format('Successfully connected to graphite @ %s:%d.', self.host, self.port));
    GraphiteReporter.super_.prototype.start.call(self, intervalInMs);
  });
};

GraphiteReporter.prototype.stop = function() {
  GraphiteReporter.super_.prototype.stop.call(this);
  this.socket.end();
};

GraphiteReporter.prototype.report = function() {
  // Don't report while reconnecting.
  if(reconnecting) {
    return;
  }
  var metrics = this.getMetrics();
  var self = this;
  var timestamp = (new Date).getTime() / 1000;

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
};

GraphiteReporter.prototype.send = function(name, value, timestamp) {
  if(reconnecting) {
    return;
  }
  this.socket.write(util.format('%s.%s %s %s\n', this.prefix, name, value,
    timestamp));
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

  var percentiles = timer.percentiles([.50,.75,.95,.98,.99,.999]);
  send(util.format('%s.%s', timer.name, 'min'), timer.min(), timestamp);
  send(util.format('%s.%s', timer.name, 'mean'), timer.mean(), timestamp);
  send(util.format('%s.%s', timer.name, 'max'), timer.max(), timestamp);
  send(util.format('%s.%s', timer.name, 'stddev'), timer.stdDev(), timestamp);
  send(util.format('%s.%s', timer.name, 'p50'), percentiles[.50], timestamp);
  send(util.format('%s.%s', timer.name, 'p75'), percentiles[.75], timestamp);
  send(util.format('%s.%s', timer.name, 'p95'), percentiles[.95], timestamp);
  send(util.format('%s.%s', timer.name, 'p98'), percentiles[.98], timestamp);
  send(util.format('%s.%s', timer.name, 'p99'), percentiles[.99], timestamp);
  send(util.format('%s.%s', timer.name, 'p999'), percentiles[.999], timestamp);
};

module.exports = GraphiteReporter;