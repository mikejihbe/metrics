var Sample = module.exports = function Sample() {
  this.values = [];
}

Sample.prototype.update = function(val){ values.push(val); };
Sample.prototype.clear = function(){ values = []; };
Sample.prototype.size = function(){ return values.length;};
