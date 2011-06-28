var EDS = require('../stats/exponentially_decaying_sample')
  , UniformSample = require('../stats/uniform_sample');

var DEFAULT_PERCENTILES = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.98, 0.99, 0.999];

/*
* A histogram tracks the distribution of items, given a sample type 
*/
var Histogram = module.exports = function Histogram(sample) {
  this.sample = sample || new EDS(1028, 0.015);
  this.min = null;
  this.max = null;
  this.sum = null;
  // These are for the Welford algorithm for calculating running variance
  // without floating-point doom.
  this.varianceM = null;
  this.varianceS = null;
  this.count = 0;
  this.type = 'histogram';
}

Histogram.prototype.clear = function() {
  this.sample.clear();
  this.min = null;
  this.max = null;
  this.sum = null;
  this.varianceM = null;
  this.varianceS = null;
  this.count = 0;
}

// timestamp param primarily used for testing
Histogram.prototype.update = function(val, timestamp) {
  this.count++;
  this.sample.update(val, timestamp);
  if (this.max === null) {
    this.max = val;
  } else {
    this.max = val > this.max ? val : this.max;
  }
  if (this.min === null) {
    this.min = val;
  } else {
    this.min = val < this.min ? val : this.min;
  }
  this.sum = (this.sum === null) ? val : this.sum + val;
  this.updateVariance(val);
}

Histogram.prototype.updateVariance = function(val) {
  var oldVM = this.varianceM
    , oldVS = this.varianceS;
  if (this.count == 1) {
    this.varianceM = val;
  } else {
    this.varianceM = oldVM + (val - oldVM) / this.count;
    this.varianceS = oldVS + (val - oldVM) * (val - this.varianceM);
  }
}

// Pass an array of percentiles, e.g. [0.5, 0.75, 0.9, 0.99]
Histogram.prototype.percentiles = function(percentiles) {
  if (!percentiles) {
    percentiles = DEFAULT_PERCENTILES;
  }
  var values = this.sample.getValues().map(function(v){ return parseFloat(v);}).sort(function(a,b){ return a-b;})
    , scores = {}
    , percentile
    , pos
    , lower
    , upper;
  for (var i = 0; i < percentiles.length; i++) {
    pos = percentiles[i] * (values.length + 1);
    percentile = percentiles[i];
    if (pos < 1) { scores[percentile] = values[0]; }
    else if (pos >= values.length) { scores[percentile] = values[values.length - 1]; }
    else {
      lower = values[Math.floor(pos) - 1];
      upper = values[Math.ceil(pos) - 1];
      scores[percentile] = lower + (pos - Math.floor(pos)) * (upper - lower);
    }
  }
  return scores;
}

Histogram.prototype.variance = function() {
  return this.count < 1 ? null : this.varianceS / (this.count - 1);
}

Histogram.prototype.mean = function() {
  return this.count == 0 ? null : this.varianceM;
}

Histogram.prototype.stdDev = function() {
  return this.count < 1 ? null : Math.sqrt(this.variance());
}

Histogram.prototype.values = function() {
  return this.sample.getValues();
}

Histogram.prototype.printObj = function() {
  var percentiles = this.percentiles();
  return {
      type: 'histogram'
    , min: this.min
    , max: this.max
    , sum: this.sum
    , variance: this.variance()
    , mean: this.mean()
    , std_dev: this.stdDev()
    , count: this.count
    , median: percentiles[0.5]
    , p75: percentiles[0.75]
    , p95: percentiles[0.95]
    , p99: percentiles[0.99]
    , p999: percentiles[0.999]};
}

module.exports.createExponentialDecayHistogram = function(size, alpha) { return new Histogram(new EDS((size || 1028), (alpha || 0.015))); };
module.exports.createUniformHistogram = function(size) { return new Histogram(new UniformSample((size || 1028))); };
module.exports.DEFAULT_PERCENTILES = DEFAULT_PERCENTILES;
