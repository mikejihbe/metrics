var Sample = module.exports = function Sample() {}
Sample.prototype.init = function(){ this.values = []; }
Sample.prototype.update = function(val){ this.values.push(val); };
Sample.prototype.clear = function(){ this.values = []; };
Sample.prototype.size = function(){ return this.values.length;};
Sample.prototype.print = function(){console.log(this.values);}
