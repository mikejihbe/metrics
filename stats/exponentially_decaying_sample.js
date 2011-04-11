var Sample = require('./sample')
  , BinaryHeap = require('../lib/binary_heap.js');

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
  this.values = new BinaryHeap(function(obj){return obj.priority;});
}

ExponentiallyDecayingSample.prototype = new Sample();

ExponentiallyDecayingSample.prototype.newHeap = function() {
  return new BinaryHeap(function(obj){return obj.priority;});
}

ExponentiallyDecayingSample.prototype.now = function() {
  return (new Date()).getTime();
}

ExponentiallyDecayingSample.prototype.clear = function() {
  this.values = [];
  this.count = 0;
  this.startTime = self.now();
  this.nextScaleTime = self.now() + RESCALE_THRESHOLD;
}

ExponentiallyDecayingSample.prototype.update = function(val, timestamp) {
  if (timestamp == undefined) {
    timestamp = self.now();
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
      while(this.values.remove(first) == null) {
        first = this.values.peek();
      }
    }
  }

  if (this.now() > this.nextScaleTime) {
    this.rescale(this.now(), this.nextScaleTime);
  }
}


ExponentiallyDecayingSample.prototype.weight = function(timestamp) {
  return Math.exp(this.alpha * timestamp);
}

ExponentiallyDecayingSample.prototype.rescale = function(now, next) {
  this.nextScaleTime = now + RESCALE_THRESHOLD;
  var newValues = this.newHeap() 
    , elt
    , oldStartTime = this.startTime;
  this.startTime = self.now();
  while(elt = this.values.pop()) {
    newValues.push({val: elt.val, priority: elt.priority * Math.exp(-this.alpha * (this.startTime - oldStartTime))});
  }
  this.values = newValues;
}

