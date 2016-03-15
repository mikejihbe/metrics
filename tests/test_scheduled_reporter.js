var ScheduledReporter = require('../').ScheduledReporter,
  helper = require('./helper.js'),
  util = require('util');

var test = function(callback) {
  var invocations = 0;

  function CountingReporter(registry) {
    CountingReporter.super_.call(this, registry);
  }
  util.inherits(CountingReporter, ScheduledReporter);

  CountingReporter.prototype.report = function() {
    invocations++;
    console.log("Invocation #%d", invocations);
  };

  var report = helper.getSampleReport();
  var reporter = new CountingReporter(report);
  console.log("Starting reporter on 2000ms interval, running for 11000ms.");
  reporter.start(2000);

  setTimeout(function() {
    console.log("Invocation count should be 5, is %d", invocations);
    console.log("Stopping reporter");
    reporter.stop();
    setTimeout(function() {
      console.log("Invocation count should still be 5, is %d", invocations);
      if (typeof callback == 'function') {
        callback();
      }
    }, 3000);
  }, 11000);
};

if (module.parent) {
  module.exports = test;
} else {
  test();
}