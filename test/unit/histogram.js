var expect = require('chai').expect
  , describe = require('mocha').describe
  , it = require('mocha').it
  , Histogram = require('../../metrics/histogram');

describe('Histogram', function() {
  it('should properly record percentiles from uniform distribution.', function() {
    var unifHist = Histogram.createUniformHistogram(5000);

    for(var i = 1; i < 10000; i++) {
      unifHist.update(i);
    }

    expect(unifHist.mean()).to.equal(5000);
    expect(unifHist.variance()).to.equal(8332500);
    expect(unifHist.stdDev()).to.equal(2886.607004772212);
    expect(unifHist.count).to.equal(9999);
    expect(unifHist.min).to.equal(1);
    expect(unifHist.max).to.equal(9999);
  });
});