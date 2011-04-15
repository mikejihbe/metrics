var EWMA = require('../stats/exponentially_weighted_moving_average.js');
/*
*  
*/
var Meter = module.exports = function Meter() {
  this.m1Rate = EWMA.createM1EWMA();
  this.m5Rate = EWMA.createM5EWMA();
  this.m15Rate = EWMA.createM15EWMA();
  this.count = 0;
  this.startTime = (new Date).getTime();
}

// Mark the occurence of n events
Meter.prototype.mark = function(n) {
  if (!n) { n = 1; }
  this.count += n;
  this.m1Rate.update(n);
  this.m5Rate.update(n);
  this.m15Rate.update(n);
}

Meter.prototype.rates = function() {
  return {1: this.oneMinuteRate()
      , 5: this.fiveMinuteRate()
      , 15: this.fifteenMinuteRate()
      , mean: this.meanRate()};
}

// Rates are per second
Meter.prototype.fifteenMinuteRate = function() {
  return this.m15Rate.rate();
}

Meter.prototype.fiveMinuteRate = function() {
  return this.m15Rate.rate();
}

Meter.prototype.oneMinuteRate = function() {
  return this.m1Rate.rate();
}

Meter.prototype.meanRate = function() {
  return this.count / ((new Date).getTime() - this.startTime) / 1000;
}

