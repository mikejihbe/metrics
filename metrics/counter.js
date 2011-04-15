/*
*  A simple counter object
*/
var Counter = module.exports = function Counter() {
  this.count = 0;
  this.type = 'counter';
}

Counter.prototype.inc = function(val) {
  if (!val) { val = 1; }
  this.count += val;
}

Counter.prototype.dec = function(val) {
  if (!val) { val = 1; }
  this.count -= val;
}

Counter.prototype.count = function() {
  return this.count;
}

Counter.prototype.clear = function() {
  this.count = 0;
}

Counter.prototype.printObj = function() {
  return {count: this.count};
}
