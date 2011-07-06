/*
*  A simple counter object
*/

/* JavaScript uses double-precision FP for all numeric types.  
 * Perhaps someday we'll have native 64-bit integers that can safely be
 * transported via JSON without additional code, but not today. */
var MAX_COUNTER_VALUE = Math.pow(2, 32); // 4294967296

var Counter = module.exports = function Counter() {
  this.count = 0;
  this.type = 'counter';
}

Counter.prototype.inc = function(val) {
  if (!val) { val = 1; }
  if (this.count === MAX_COUNTER_VALUE) {
    this.count = 0;
  } else {
    this.count += val;
  }
}

Counter.prototype.dec = function(val) {
  if (!val) { val = 1; }
  if (this.count > 0) {
    this.count -= val;
  }
}

Counter.prototype.clear = function() {
  this.count = 0;
}

Counter.prototype.printObj = function() {
  return {type: 'counter', count: this.count};
}
