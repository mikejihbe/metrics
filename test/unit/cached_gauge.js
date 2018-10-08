var expect = require('chai').expect
  , describe = require('mocha').describe
  , it = require('mocha').it
  , CachedGauge = require('../../metrics/cached_gauge');

describe('CachedGauge', function() {
  function seqFn() {
    var i = 0;
    return function() {
      return i++;
    }
  }

  it('should call function when asked for a value for the first time.', function() {
    var gauge = new CachedGauge(seqFn(), 100);
    expect(gauge.printObj()).to.have.property('value', 0);
  });

  it('should not call function before expiration timeout.', function() {
    var gauge = new CachedGauge(seqFn(), 1000);
    expect(gauge.printObj()).to.have.property('value', 0);
    expect(gauge.printObj()).to.have.property('value', 0);
  });

  it('should call function after expiration timeout.', function(done) {
    var gauge = new CachedGauge(seqFn(), 50);
    expect(gauge.printObj()).to.have.property('value', 0);
    setTimeout(function() {
      expect(gauge.printObj()).to.have.property('value', 1);
      done();
    }, 100);
  });
});
