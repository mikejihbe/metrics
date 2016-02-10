var Sample = require('./sample');

/*
 *  Take a uniform sample of size size for all values
 */
var UniformSample = module.exports = function UniformSample(size) {
  this.limit = size;
  this.count = 0;
  this.init();
}

UniformSample.prototype = new Sample();

UniformSample.prototype.update = function(val) {
  this.count++;
  if (this.size() < this.limit) {
    //console.log("Adding "+val+" to values.");
    this.values.push(val);
  } else {
    var rand = parseInt(Math.random() * this.count);
    if (rand < this.limit) {
      this.values[rand] = val;
    }
  }
}
