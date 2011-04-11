require 'sample'

var UniformSample = module.exports = function UniformSample(size) {
  this.limit = size;
  this.count = 0;
}

UniformSample.prototype = new Sample();

UniformSample.prototype.update = function(val) {
  if (this.size() < this.limit) {
    this.values.push(val);
  } else {
    var rand = Math.random();
    if (rand < 1/this.limit) {
      this.values[Math.floor(rand*count)] = val;
    }
  }
}
