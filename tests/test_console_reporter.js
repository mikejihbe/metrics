var ConsoleReporter = require('../').ConsoleReporter,
  helper = require('./helper.js');

var test = function(callback) {
  var report = helper.getSampleReport();
  var reporter = new ConsoleReporter(report);
  reporter.report();

  console.log("basicCount should be 5, myapp.Meter should be 10, myapp.Timer should be 100");

  if (typeof callback == 'function') {
    callback();
  }
};

if (module.parent) {
  module.exports = test;
} else {
  test();
}