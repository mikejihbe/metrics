var Sample = module.exports = function Sample() {
  this.values = [];
  this.count = 0;
}
var Sample = module.exports = function Sample() {}
Sample.prototype.init = function(){ this.clear(); }
Sample.prototype.update = function(val){ this.values.push(val); };
Sample.prototype.clear = function(){ this.values = []; this.count = 0; };
Sample.prototype.size = function(){ return this.values.length;};
Sample.prototype.print = function(){console.log(this.values);}
Sample.prototype.getValues = function(){ return this.values; }

