var expect = require('chai').expect
  , debug = require('debug')('metrics')
  , describe = require('mocha').describe
  , it = require('mocha').it
  , UniformSample = require('../../stats/uniform_sample');

describe('UniformSample', function () {
  it('average of sampled values should fall within acceptable range of actual mean.', function () {
    debug("Creating a new UniformSample with a limit of 600.");
    var uniformSample = new UniformSample(600);
    for (var i = 0; i < 10000; i++) {
      uniformSample.update(i);
    }

    var sum = 0;
    for (var k in uniformSample.values) {
      sum += uniformSample.values[k];
    }
    var mean = sum / uniformSample.values.length;
    debug("Mean of sample is %j", mean);
    // actual mean of all 10000 values should be 5000.
    expect(mean).to.be.within(4500, 5500);
  });
});