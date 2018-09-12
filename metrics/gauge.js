var Gauge = module.exports = function Gauge(valFn) {
  this.valFn = valFn;
  this.type = 'gauge';
}

Gauge.prototype.printObj = function() {
  return {type: 'gauge', value: this.valFn()};
}
