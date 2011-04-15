var ExponentiallyWeightedMovingAverage = require('../stats/exponentially_weighted_moving_average');
var exponentially_weighted_moving_average = new ExponentiallyWeightedMovingAverage.createM1EWMA();

var test = function (callback) {
  console.log("\nTesting ExponentiallyWeightedMovingAverage\n");
  console.log("Sending updates every 100 milliseconds for 30 seconds.");

  var updateInterval = setInterval(function(){
    exponentially_weighted_moving_average.update();
  }, 100);
  setTimeout(function(){
    clearInterval(updateInterval);
    console.log("\n\nExpected Average: 10");
    console.log("Exponentially Weighted Moving Average: "+exponentially_weighted_moving_average.rate()+"\n");
    if (typeof callback == 'function') {
      callback();
    }
  }, 30000);
}

if (module.parent) {
  module.exports = test;
} else {
  test();
}
