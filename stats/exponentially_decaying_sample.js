var Sample = require('./sample')
  , BinaryHeap = require('../lib/binary_heap');

/*
 *  Take an exponentially decaying sample of size size of all values
 */
var RESCALE_THRESHOLD = 60 * 60 * 1000; // 1 hour in milliseconds

var ExponentiallyDecayingSample = module.exports = function ExponentiallyDecayingSample(size, alpha) {
  this.limit = size;
  this.alpha = alpha;
  this.clear();
}

ExponentiallyDecayingSample.prototype = new Sample();

// This is a relatively expensive operation
ExponentiallyDecayingSample.prototype.getValues = function() {
  var values = []
    , elt
    , heap = this.values.clone();
  while(elt = heap.pop()) {
    values.push(elt.val);
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
      this.values.pop();
    }
  }

  if (this.now() > this.nextScaleTime) {
    this.rescale(this.now(), this.nextScaleTime);
  }
}

ExponentiallyDecayingSample.prototype.weight = function(time) {
  return Math.exp(this.alpha * time);
}

// now: parameter primarily used for testing rescales
ExponentiallyDecayingSample.prototype.rescale = function(now) {
  this.nextScaleTime = this.now() + RESCALE_THRESHOLD;
  var oldContent = this.values.content
    , newContent = []
    , oldStartTime = this.startTime;
  this.startTime = (now && now / 1000) || this.tick();
  // Downscale every priority by the same factor. Order is unaffected, which is why we're avoiding the cost of popping.
  for(var i = 0; i < oldContent.length; i++) {
    newContent.push({val: oldContent[i].val, priority: oldContent[i].priority * Math.exp(-this.alpha * (this.startTime - oldStartTime))});
  }
  this.values.content = newContent;
}
