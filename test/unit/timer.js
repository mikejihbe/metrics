var expect = require('chai').expect
  , describe = require('mocha').describe
  , it = require('mocha').it
  , Timer = require('../../metrics/timer');

describe('Timer', function() {
  it('should properly record durations.', function(done) {
    var timer = new Timer();

    var n = 0;
    var updateInterval = setInterval(function() {
      timer.update(n++);
    }, 100);

    setTimeout(function() {
      clearInterval(updateInterval);
      timer.tick();
      expect(timer.count()).to.be.within(8, 12);
      expect(timer.min()).to.equal(0);
      expect(timer.max()).to.be.within(8, 12);
      expect(timer).to.have.property('mean');
      expect(timer).to.have.property('stdDev');
      expect(timer).to.have.property('percentiles');
      expect(timer).to.have.property('values');
      expect(timer).to.have.property('oneMinuteRate');
      expect(timer).to.have.property('fiveMinuteRate');
      expect(timer).to.have.property('fifteenMinuteRate');
      expect(timer).to.have.property('meanRate');
      expect(timer).to.have.property('rates');
      done();
    }, 1000);
  });
});