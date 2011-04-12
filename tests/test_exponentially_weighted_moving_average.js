var ExponentiallyWeightedMovingAverage = require('../stats/exponentially_weighted_moving_average');
var exponentially_weighted_moving_average = new ExponentiallyWeightedMovingAverage((1 - Math.exp(-5/60)));

var test = function (callback) {
  console.log("\nTesting ExponentiallyWeightedMovingAverage\n");
  console.log("Sending updates every 100 milliseconds for 30 seconds.");
  console.log("Ticking every second.\n");

  var tickInterval = setInterval(function(){
    exponentially_weighted_moving_average.tick();
    process.stdout.write(".")
  }, 1000);
  var updateInterval = setInterval(function(){
    exponentially_weighted_moving_average.update();
  }, 100);
  setTimeout(function(){
    clearInterval(tickInterval);
    clearInterval(updateInterval);
    console.log("\n\nExpected Average: 10");
    console.log("Exponentially Weighted Moving Average: "+exponentially_weighted_moving_average.rate()+"\n");
    if (typeof callback != 'undefined') {
      callback();
    }
  }, 30000);
}

if (module.parent) {
  module.exports = test;
} else {
  test();
}