'use strict';
var Counter = require('../metrics').Counter,
  Histogram = require('../metrics').Histogram,
  Meter = require('../metrics').Meter,
  Timer = require('../metrics').Timer,
  Gauge = require('../metrics').Gauge,
  util = require('util'),
  EventEmitter = require('events').EventEmitter;

/**
 * Creates a scheduled reporter instance with a given report instance.  This is meant to be extended and not used on
 * its own, see {@link GraphiteReporter} for an example implementation.
 * @param {Report} registry report instance whose metrics to report on.
 * @constructor
 */
function ScheduledReporter(registry) {
  ScheduledReporter.super_.call(this);
  this.registry = registry;
}

util.inherits(ScheduledReporter, EventEmitter);

/**
 * Starts the calling {@link ScheduledReporter.report} on a scheduled interval.
 * @param {Number} intervalInMs Number How often to report in milliseconds.
 */
ScheduledReporter.prototype.start = function(intervalInMs) {
  this.interval = setInterval(this.report.bind(this), intervalInMs);
};

/**
 * Stops the reporter if it was previously started.
 */
ScheduledReporter.prototype.stop = function() {
  if('interval' in this) {
    clearInterval(this.interval);
  }
};

/**
 * Method that is called on every intervalInMs that was passed into {@link ScheduledReporter.start}.  This method
 * does nothing and should be overridden by implementers.
 */
ScheduledReporter.prototype.report = function() {
  // implemented by children.
};

/**
 * Retrieve the metrics associated with the report given to this reporter in a format that's easy to consume
 * by reporters.  That is an object with separate references for meters, timers counters, and histograms.
 * @returns {{meters: Array, timers: Array, counters: Array}}
 */
ScheduledReporter.prototype.getMetrics = function() {
  var meters = [];
  var timers = [];
  var counters = [];
  var histograms = [];
  var gauges = [];

  var trackedMetrics = this.registry.trackedMetrics;
  // Flatten metric name to be namespace.name is has a namespace and separate out metrics
  // by type.
  for(var namespace in trackedMetrics) {
    for(var name in trackedMetrics[namespace]) {
      var metric = trackedMetrics[namespace][name];
      if(namespace.length > 0) {
        metric.name = namespace + '.' + name;
      } else {
        metric.name = name;
      }
      if(metric instanceof Meter) {
        meters.push(metric);
      } else if(metric instanceof Timer) {
        timers.push(metric);
      } else if(metric instanceof Counter) {
        counters.push(metric);
      } else if(metric instanceof Histogram) {
        histograms.push(metric);
      } else if(metric instanceof Gauge) {
        gauges.push(metric);
      }
    }
  }

  return { meters: meters, timers: timers, counters: counters, histograms: histograms, gauges: gauges };
};

module.exports = ScheduledReporter;
