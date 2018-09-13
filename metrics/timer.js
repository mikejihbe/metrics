var Meter = require('./meter'),
    Histogram = require('./histogram'),
    ExponentiallyDecayingSample = require('../stats/exponentially_decaying_sample');

var MILLIS_IN_SEC = 1e3;
var MILLIS_IN_NANO = 1e-6;

var TimerContext = function(timer) {
  this.timer = timer;
  this.start = process.hrtime();
}

/**
 * Calls [update]{@link Timer#update} on the associated timer recording
 * the elapsed duration from when this context was created to now in
 * milliseconds.
 *
 * This may be called successive times to record multiple durations.
 */
TimerContext.prototype.stop = function() {
  var duration = process.hrtime(this.start);
  this.timer.update(duration[0] * MILLIS_IN_SEC + duration[1] * MILLIS_IN_NANO);
}

/*
*  Basically a timer tracks the rate of events and histograms the durations
*/
var Timer = module.exports = function Timer() {
  this.meter = new Meter();
  this.histogram = new Histogram(new ExponentiallyDecayingSample(1028, 0.015));
  this.clear();
  this.type = 'timer';
}

Timer.prototype.update = function(duration) {
  this.histogram.update(duration);
  this.meter.mark();
}

/**
 * Creates a context used to record elapsed milliseconds between now and
 * when [stop]{@link TimerContext#stop} is called.
 *
 * @returns {TimerContext}
 */
Timer.prototype.time = function() {
  return new TimerContext(this)
}

// delegate these to histogram
Timer.prototype.clear = function() { return this.histogram.clear(); }
Timer.prototype.count = function() { return this.histogram.count; }
Timer.prototype.min = function() { return this.histogram.min; }
Timer.prototype.max = function() { return this.histogram.max; }
Timer.prototype.mean = function() { return this.histogram.mean(); }
Timer.prototype.stdDev = function() { return this.histogram.stdDev(); }
Timer.prototype.percentiles = function(percentiles) { return this.histogram.percentiles(percentiles); }
Timer.prototype.values = function() { return this.histogram.values(); }

// delegate these to meter
Timer.prototype.oneMinuteRate = function() { return this.meter.oneMinuteRate(); }
Timer.prototype.fiveMinuteRate = function() { return this.meter.fiveMinuteRate(); }
Timer.prototype.fifteenMinuteRate = function() { return this.meter.fifteenMinuteRate(); }
Timer.prototype.meanRate = function() { return this.meter.meanRate(); }
Timer.prototype.tick = function() { this.meter.tick(); } // primarily for testing
Timer.prototype.rates = function() { return this.meter.rates(); }

Timer.prototype.printObj = function() {
  return {type: 'timer'
      , duration: this.histogram.printObj()
      , rate: this.meter.printObj()};
}

