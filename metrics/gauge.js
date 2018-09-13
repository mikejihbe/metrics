var Gauge = module.exports = function Gauge(valueFn) {
  this.value = valueFn;
  this.type = 'gauge';
}

Gauge.prototype.printObj = function() {
  return {type: 'gauge', value: this.value()};
}
