var expect = require('chai').expect
  , describe = require('mocha').describe
  , it = require('mocha').it
  , Gauge = require('../../metrics/gauge');

describe('Gauge', function() {
  it('should reflect function value', function() {
    var i = 0;
    var gauge = new Gauge(function() { return i++; });

    expect(gauge.printObj()).to.have.property('value', 0);
    expect(gauge.printObj()).to.have.property('value', 1);
  });
});
