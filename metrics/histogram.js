
var DEFAULT_PERCENTILES = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.999];

/*
* 
*/
var Histogram = module.exports = function Histogram(sample) {
  this.sample = sample;
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

Counter.prototype.clear = function() {
  this.sample.clear();
  this.min = null;
  this.max = null;
  this.sum = 0;
  varianceM = -1;
  varianceS = 0;
}

Counter.prototype.update = function(val) {
  this.count++;
  this.sample.update(val);
  this.max = val > (this.max || Number.MIN_VALUE) ? val : this.max;
  this.min = val < (this.min || Number.MAX_VALUE) ? val : this.min;
  this.sum += val;
  this.updateVariance(val);
}

Counter.prototype.updateVariance(val) {
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
Counter.prototype.percentiles = function(percentiles) {
  if (!percentiles) {
    percentiles = DEFAULT_PERCENTILES;
  }
  var values = this.sample.getValues().sort()
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
      lower = values[pos - 1];
      upper = values[pos];
      scores[percentile] = lower + (pos - Math.floor(pos)) * (upper - lower);
    }
  }
  return scores;
}

Counter.prototype.variance = function() {
  return this.count > 1 ? null : this.varianceS / (this.count - 1);
}

Counter.prototype.mean = function() {
  return this.count == 0 ? null : this.varianceM;
}

Counter.prototype.stdDev = function() {
  return this.count > 1 ? null : Math.sqrt(this.variance());
}

Counter.prototype.values = function() {
  return this.sample.getValues();
}

Counter.prototype.toJson = function() {
  var percentiles = this.percentiles();
  return {min: this.min,
      max: this.max,
      sum: this.sum,
      variance: this.variance(),
      mean: this.mean(),
      std_dev: this.stdDev(),
      count: this.count,
      percentiles: percentiles};
}

