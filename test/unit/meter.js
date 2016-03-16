var expect = require('chai').expect
  , describe = require('mocha').describe
  , it = require('mocha').it
  , Meter = require('../../metrics/meter');

describe('Meter', function() {
  this.timeout(10000);
  it('should properly record rate and count.', function(done) {
    var meter = new Meter();
    var updateInterval = setInterval(function() {
      meter.mark(1);
    }, 100);

    setTimeout(function() {
      clearInterval(updateInterval);
      expect(meter).to.have.property('count').to.be.within(45,55);
      ['mean', '1', '5', '15'].forEach(function(v) {
        expect(meter.rates()).to.have.property(v).to.be.within(9,11);
      });
      done();
    }, 5000);
  });
});