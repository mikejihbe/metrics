var utils = require('../lib/utils');
var Sample = require('./sample');

/*
*  Take a uniform sample of size size for all values
*/
var UniformSample = module.exports = function UniformSample(size) {
  this.limit = size;
  this.count = 0;
}

utils.mixin(Sample, UniformSample);

UniformSample.prototype.update = function(val) {
  console.log("got here: " + val);
  if (this.size() < this.limit) {
    this.values.push(val);
  } else {
    var rand = Math.random();
    if (rand < 1/this.limit) {
      this.values[Math.floor(rand*count)] = val;
    }
  }
}
