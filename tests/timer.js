var Timer = require('../metrics/timer');

var test = function(callback){
  console.log("\nCreating a new timer, updating 10 times / sec for 30 secs");
  var timer = new Timer()
      , n = 0;

  var updateInterval = setInterval(function(){
    //simulates the duration that a task takes between 0 and 500 milliseconds
    //And then update the timer for the duration of that time
    var duration = Math.round(Math.random() * (500));
    timer.update(duration);
    n += 1;
    if (n % 10 == 0) {
      process.stdout.write(".")
    }
  }, 100);

  setTimeout(function(){
    clearInterval(updateInterval);
    console.log('Expected rate: 10/sec');
    console.log('count: ' + timer.count());
    console.log('min: ' + timer.min());
    console.log('max: ' + timer.max());
    console.log('mean: ' + timer.mean());
    console.log('stdDev: ' + timer.stdDev());
    console.log('percentiles: ' + JSON.stringify(timer.percentiles(), undefined, 2));
    console.log('oneMinuteRate: ' + timer.oneMinuteRate());
    console.log('fiveMinuteRate: ' + timer.fiveMinuteRate());
    console.log('fifteeenMinuteRate: ' + timer.fifteenMinuteRate());
    console.log('meanRate: ' + timer.meanRate());
  }, 30000);

  if (typeof callback == 'function') {
    callback();
  }
};

if (module.parent) {
  module.exports = test;
} else {
  test();
}

