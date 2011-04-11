var Sample = module.exports = function Sample() {
  this.values = [];
  this.update = function(val){ values.push(val); };
  this.clear = function(){ values = []; };
  this.size = function(){ return values.length;};
}
