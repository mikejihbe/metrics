var Timer = require('../metrics/timer');

var test = function(callback){
  console.log("\nCreating a new timer, updating 10 times / sec for 30 secs");
  var timer = new Timer();

  for(var i = 0; i < 10000; i++) {
    timer.update(i);
  }
  timer.tick();
  console.log(timer.count());
  console.log(timer.min());
  console.log(timer.max());
  console.log(timer.mean());
  console.log(timer.stdDev());
  console.log(timer.percentiles());
  console.log(timer.oneMinuteRate());
  console.log(timer.fiveMinuteRate());
  console.log(timer.fifteenMinuteRate());
  console.log(timer.meanRate());
  if (typeof callback == 'function') {
    callback();
  }
}

if (module.parent) {
  module.exports = test;
} else {
  test();
}

