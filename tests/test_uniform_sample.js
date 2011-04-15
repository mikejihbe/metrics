var UniformSample = require('../stats/uniform_sample');

var test = function(callback){
  console.log("\nCreating a new UniformSample with a limit of 600.");
  var uniform_sample = new UniformSample(600);
  console.log("Sending 10000 updates to the UniformSample.")
  for (var i = 0; i<10000; i++) {
    uniform_sample.update(i);
  }
  var sum = 0;
  for (var k in uniform_sample.values) {
    sum += uniform_sample.values[k];
  }
  var mean = sum / uniform_sample.values.length;
  console.log("\nAverage of Sample: "+mean);
  console.log("Average of 'real data': 5000\n");
  if (typeof callback == 'function') {
    callback();
  }
}

if (module.parent) {
  module.exports = test;
} else {
  test();
}