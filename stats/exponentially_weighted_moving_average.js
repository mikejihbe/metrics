/*
 *  Exponentially weighted moving average.
 *  Args: 
 *  - alpha:
 *  - interval: time in milliseconds
 */

var M1_ALPHA = 1 - Math.exp(-5/60);
var M5_ALPHA = 1 - Math.exp(-5/60/5);
var M15_ALPHA = 1 - Math.exp(-5/60/15);

var EWMA = module.exports = function(alpha, interval) {
  var self = this;
  this.alpha = alpha;
  this.interval = interval || 5000;
  this.initialized = false;
  this.currentRate = 0.0;
  this.uncounted = 0;
  if (interval) {
    this.tickInterval = setInterval(function(){ self.tick(); }, interval);

    if (this.tickInterval.unref) {
      // Don't keep the process open if this is the last thing in the event loop.
      this.tickInterval.unref();
    }
  }
}

EWMA.prototype.update = function(n) {
  this.uncounted += (n || 1);
}

/*
 * Update our rate measurements every interval
 */
EWMA.prototype.tick = function() {
  var  instantRate = this.uncounted / this.interval;
  this.uncounted = 0;
  
  if(this.initialized) {
    this.currentRate += this.alpha * (instantRate - this.currentRate);
  } else {
    this.currentRate = instantRate;
    this.initialized = true;
  }
}

/*
 * Return the rate per second
 */
EWMA.prototype.rate = function() {
  return this.currentRate * 1000;
}

EWMA.prototype.stop = function() {
  clearInterval(this.tickInterval);
}

module.exports.createM1EWMA = function(){ return new EWMA(M1_ALPHA, 5000); }
module.exports.createM5EWMA = function(){ return new EWMA(M5_ALPHA, 5000); }
module.exports.createM15EWMA = function(){ return new EWMA(M15_ALPHA, 5000); }
