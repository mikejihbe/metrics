var Gauge = require('./gauge'),
  util = require('util');

function now() {
  return new Date().getTime();
}

function CachedGauge(valueFn, expirationInMs) {
  var value, lastRefresh;
  Gauge.call(this, function() {
    if (!lastRefresh || now() - lastRefresh > expirationInMs) {
      value = valueFn();
      lastRefresh = now();
    }
    return value;
  });
}

util.inherits(CachedGauge, Gauge);

module.exports = CachedGauge
