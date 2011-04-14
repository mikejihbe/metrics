var Sample = require('./sample')
  , BinaryHeap = require('../lib/binary_heap')
  , util = require('util')
  , utils = require('../lib/utils');

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

// This is a relatively expensive operation
ExponentiallyDecayingSample.prototype.getValues = function() {
  var values = []
    , heap = this.values.clone();
  while(elt = heap.pop()) {
    values.push(elt);
  }
  return values;
}

ExponentiallyDecayingSample.prototype.size = function() {
  return this.values.size();
}

ExponentiallyDecayingSample.prototype.newHeap = function() {
  return new BinaryHeap(function(obj){return obj.priority;});
}

ExponentiallyDecayingSample.prototype.now = function() {
  return (new Date()).getTime();
}

ExponentiallyDecayingSample.prototype.tick = function() {
  return this.now() / 1000;
}

ExponentiallyDecayingSample.prototype.clear = function() {
  this.values = this.newHeap();
  this.count = 0;
  this.startTime = this.tick();
  this.nextScaleTime = this.now() + RESCALE_THRESHOLD;
}

/*
* timestamp in milliseconds
*/
ExponentiallyDecayingSample.prototype.update = function(val, timestamp) {
  // Convert timestamp to seconds
  if (timestamp == undefined) {
    timestamp = this.tick();
  } else {
    timestamp = timestamp / 1000;
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

ExponentiallyDecayingSample.prototype.weight = function(time) {
  return Math.exp(this.alpha * time);
}

ExponentiallyDecayingSample.prototype.rescale = function(now, next) {
  this.nextScaleTime = now + RESCALE_THRESHOLD;
  var newValues = this.newHeap() 
    , elt
    , oldStartTime = this.startTime;
  this.startTime = self.tick();
  // TODO: make this not pop them all, just iterate through them
  while(elt = this.values.pop()) {
    newValues.push({val: elt.val, priority: elt.priority * Math.exp(-this.alpha * (this.startTime - oldStartTime))});
  }
  this.values = newValues;
}

