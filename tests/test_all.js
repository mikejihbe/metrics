var testUniformSample = require('./test_uniform_sample');
var testExponentiallyWeightedMovingAverage = require('./test_exponentially_weighted_moving_average');

testExponentiallyWeightedMovingAverage(function(){
  testUniformSample(function(){
    // Next test goes here.
  });
});