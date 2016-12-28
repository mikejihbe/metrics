var expect = require('chai').expect
  , debug = require('debug')('metrics')
  , describe = require('mocha').describe
  , helper = require('./helper.js')
  , it = require('mocha').it
  , util = require('util')
  , ScheduledReporter = require('../../').ScheduledReporter;

describe('ScheduledReporter', function () {
  this.timeout(20000);
  it ('should report on interval.', function (done) {
    var invocations = 0;

    function CountingReporter(registry) {
      CountingReporter.super_.call(this, registry);
    }
    util.inherits(CountingReporter, ScheduledReporter);

    CountingReporter.prototype.report = function() {
      invocations++;
      debug("Invocation #%d", invocations);
    };

    var report = helper.getSampleReport();
    var reporter = new CountingReporter(report);
    debug("Starting reporter on 2000ms interval, running for 11000ms.");
    reporter.start(2000);

    setTimeout(function() {
      expect(invocations).to.equal(5);
      debug("Stopping reporter and waiting 3 seconds to ensure report isn't called again.");
      reporter.stop();
      setTimeout(function() {
        expect(invocations).to.equal(5);
        done();
      }, 3000);
    }, 11000);
  });
});

