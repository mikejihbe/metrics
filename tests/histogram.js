var Histogram = require('../metrics/histogram');

var test = function(callback){
  console.log("\nCreating a new histogram");
  var edsHist = Histogram.createExponentialDecayHistogram(5000)
    , unifHist = Histogram.createUniformHistogram(5000)
    , time = (new Date()).getTime();
  
  console.log("Seeding histograms with values 1-10000, evenly distributed");

  for(var i = 0; i < 10000; i++) {
    edsHist.update(i, time + ((2+i) * 60*60*1000 / 10000));
    unifHist.update(i);
  }

  console.log("Uniform Expected Percentiles: " + JSON.stringify(Histogram.DEFAULT_PERCENTILES.map(function(v){return v * 10000;})));
  console.log(unifHist.percentiles());
  console.log("Uniform Expected Mean: 5000.5");
  console.log("Uniform mean: " + unifHist.mean());
  console.log("Uniform Expected Variance: 8333333.25");
  console.log("Uniform variance: " + unifHist.variance());
  console.log("Uniform Expected stdDev: 2886.75133151437");
  console.log("Uniform stdDev: " + unifHist.stdDev());

  console.log("Exponential decay: ");
  console.log(edsHist.percentiles());

  if (typeof callback == 'function') {
    callback();
  }
}

if (module.parent) {
  module.exports = test;
} else {
  test();
}


