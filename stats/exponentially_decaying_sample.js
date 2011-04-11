require('sample');

/**
 * An exponentially-decaying random sample of {@code long}s. Uses Cormode et
 * al's forward-decaying priority reservoir sampling method to produce a
 * statistically representative sample, exponentially biased towards newer
 * entries.
 */
var ExponentiallyDecayingSample = module.exports = function(size, alpha) {
  this.limit = size;
  this.alpha = alpha;
  this.values = [];
  this.locked = false;
}

ExponentiallyDecayingSample.prototype = new Sample();

ExponentiallyDecayingSample.prototype.update = function(value, timestamp){};
ExponentiallyDecayingSample.prototype.