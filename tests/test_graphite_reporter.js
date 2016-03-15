var GraphiteReporter = require('../').GraphiteReporter,
  helper = require('./helper.js'),
  net = require('net');

var test = function(callback) {
  var reporter;
  var connectCount = 0;
  var server = net.createServer(function (client) {
    console.log("Reporter connected.");
    client.on('data', function(data) {
      console.log("Got data: %s", data);
    });

    connectCount++;
    // On first connect, schedule a disconnect in 5 seconds.
    if(connectCount == 1) {
      setTimeout(function () {
        console.log("Closing client to see if it reconnects.");
        client.destroy();
      }, 5000);
    } else {
      // On second connect, shutdown in 2.5 secs.
      setTimeout(function () {
        console.log("Shutting down reporter and server.");
        reporter.stop();
        server.close();
        if (typeof callback == 'function') {
          callback();
        }
      }, 2500);
    }
  });

  server.on('error', function(err) {
    console.log("Got error :( %s", err);
  });

  console.log("Starting fake graphite server.");
  server.listen( function() {
    var address = server.address();
    var report = helper.getSampleReport();
    reporter = new GraphiteReporter(report, "host1", address.address, address.port);
    reporter.on('log', function(level, msg, exc) {
      if(exc) {
        console.log('%s -- %s (%s)', level, msg, exc);
      } else {
        console.log('%s -- %s', level, msg);
      }
    });
    reporter.start(1000);
  });
};

if (module.parent) {
  module.exports = test;
} else {
  test();
}