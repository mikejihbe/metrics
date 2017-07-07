var assert = require('chai').assert
  , describe = require('mocha').describe
  , it = require('mocha').it
  , Timer = require('../../metrics/timer');

describe('Timer', function() {
  it('should properly record durations', function(done) {
    var timeTest = new Timer();
    // Run #1
    timeTest.time();
    setTimeout(function() {
      timeTest.stop();
      // When you run a timer.stop(), it increments the count and adds
      // the duration to the histogram.  There can be a little deviation
      // but it should be between 699-710 ms.
      assert.equal(timeTest.count(), 1);
      assert.isAtLeast(timeTest.mean(), 699);
      assert.isAtMost(timeTest.mean(), 710);
      // Run #2 (callbacks make this a bit unclear)
      timeTest.time();
      setTimeout(function() {
        timeTest.stop();
        // 2 runs with 700ms and 800ms timeouts
        assert.equal(timeTest.count(), 2);
        assert.isAtLeast(timeTest.mean(), 740);
        assert.isAtMost(timeTest.mean(), 760);
        done();
      }, 800);
    }, 700);
  });
});