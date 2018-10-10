var expect = require('chai').expect
  , describe = require('mocha').describe
  , it = require('mocha').it
  , Counter = require('../../metrics/counter')

describe('Counter', function() {
  it('inc() should do nothing when 0 is passed', function() {
    var counter = new Counter();
    counter.inc(0);

    expect(counter.count).to.equal(0);
  });
  it('dec() should do nothing when 0 is passed', function() {
    var counter = new Counter();
    counter.dec(0);

    expect(counter.count).to.equal(0);
  });
});
