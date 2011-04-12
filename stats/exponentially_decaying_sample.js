var Sample = require('./sample')
  , BinaryHeap = require('../lib/binary_heap');

/*
*  Take a uniform sample of size size for all values
*/
var RESCALE_THRESHOLD = 60 * 60 * 1000; // 1 hour in milliseconds

var ExponentiallyDecayingSample = module.exports = function ExponentiallyDecayingSample(size, alpha) {
  this.count = 0;
  this.limit = size;
  this.alpha = alpha;
  this.startTime = 0;
  this.nextScaleTime = 0;
  this.values = this.newHeap();
}

ExponentiallyDecayingSample.prototype = new Sample();

ExponentiallyDecayingSample.prototype.newHeap = function() {
  return new BinaryHeap(function(obj){return obj.priority;});
}

ExponentiallyDecayingSample.prototype.now = function() {
  return (new Date()).getTime();
}

ExponentiallyDecayingSample.prototype.clear = function() {
  this.values = this.newHeap();
  this.count = 0;
  this.startTime = this.now();
  this.nextScaleTime = this.now() + RESCALE_THRESHOLD;
}

ExponentiallyDecayingSample.prototype.update = function(val, timestamp) {
  if (timestamp == undefined) {
    timestamp = this.now();
  }
  var priority = this.weight(timestamp - this.startTime) / Math.random()
    , value = {val: val, priority: priority};
  if (this.count < this.limit) {
    this.count += 1;
    this.values.push(value);
  } else {
    var first = this.values.peek();
    if (first.priority < priority) {
      this.values.push(value);
      console.log(first);
      console.log(this.values);
      while(this.values.remove(first) == null) {
        first = this.values.peek();
      }
    }
  }

  if (this.now() > this.nextScaleTime) {
    this.rescale(this.now(), this.nextScaleTime);
  }
}


ExponentiallyDecayingSample.prototype.weight = function(time) {
  return Math.exp(this.alpha * time);
}

ExponentiallyDecayingSample.prototype.rescale = function(now, next) {
  this.nextScaleTime = now + RESCALE_THRESHOLD;
  var newValues = this.newHeap() 
    , elt
    , oldStartTime = this.startTime;
  this.startTime = self.now();
  // TODO: make this not pop them all, just iterate through them
  while(elt = this.values.pop()) {
    newValues.push({val: elt.val, priority: elt.priority * Math.exp(-this.alpha * (this.startTime - oldStartTime))});
  }
  this.values = newValues;
}

