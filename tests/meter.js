var Meter = require('../metrics/meter');

var test = function(callback){
  console.log("\nCreating a new meter, updating 10 times / sec for 30 secs");
  var meter = new Meter(600)
    , n = 0;
  var updateInterval = setInterval(function(){
    meter.mark(1);
    n += 1;
    if (n % 10 == 0) {
      process.stdout.write(".")
    }
  }, 100);
  setTimeout(function(){
    clearInterval(updateInterval);
    console.log('Expected rate: 10/sec');
    console.log(meter.rates());
  }, 30000);


  if (typeof callback == 'function') {
    callback();
  }
}

if (module.parent) {
  module.exports = test;
} else {
  test();
}

