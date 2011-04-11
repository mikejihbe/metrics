var utils = require('../lib/utils');
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
    var rand = Math.random();
    if (rand < this.limit/this.count) {
      //console.log(rand+"*"+this.limit+"="+rand*this.limit);
      this.values[Math.floor(Math.random()*this.limit)] = val;
      //console.log("Adding "+val+" to values.");
    }
    /* 
    else {
      console.log("Not adding to values this time.");
    }
    */
  }
}
