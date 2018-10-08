var chai = require('chai')
  , debug = require('debug')('metrics')
  , expect = chai.expect
  , assert = chai.assert
  , describe = require('mocha').describe
  , helper = require('./helper.js')
  , it = require('mocha').it
  , net = require('net')
  , util = require('util')
  , os = require('os')
  , GraphiteReporter = require('../../').GraphiteReporter;

chai.use(require('chai-string'));


describe('GraphiteReporter', function () {
  this.timeout(30000);
  it ('should report to graphite.', function (done) {
    var connectCount = 0;
    var reporter;
    var dataByTs = {};
    var countOnDisconnect;
    var server = net.createServer(function (client) {
      debug("Reporter connected.");
      client.on('data', function(data) {
        debug('Received data:\n%s', data);
        var lines = data.toString("UTF-8").split('\n');
        lines.forEach(function(l) {
          var d = l.split(' ');
          var ts = d[2];
          var nameAndVal = d.slice(0, 2);
          if(ts) {
            if (!(ts in dataByTs)) {
              dataByTs[ts] = [];
            }
            dataByTs[ts].push(nameAndVal);
          }
        });
      });

      connectCount++;
      // On first connect, schedule a disconnect in 5 seconds.
      if(connectCount == 1) {
        setTimeout(function () {
          debug("Closing client to see if it reconnects.");
          client.destroy();
          countOnDisconnect = Object.keys(dataByTs).length;
        }, 5000);
      } else {
        // On second connect, shutdown in 2.5 secs.
        setTimeout(function () {
          debug("Shutting down reporter and server.");
          if (reporter) {
            reporter.stop();
          }
          server.close();
          if (typeof callback == 'function') {
            callback();
          }
          var totalReports = Object.keys(dataByTs).length;
          // should expect more reports since disconnected.
          expect(totalReports).to.be.greaterThan(countOnDisconnect);

          Object.keys(dataByTs).forEach(function (ts) {
            var tsData = dataByTs[ts];
            // Counter should have 1 value.
            // Meter should have 5 values.
            // Timer should have 15 values.
            // Histogram should have 11 values.
            // Gauge should have 1 value.
            expect(tsData.length).to.equal(33);
            // Metric names should start with host name.
            tsData.forEach(function (metric) {
              expect(metric[0]).to.startsWith('host1.');
            });
            // Timestamp should contain only digits
            expect(ts).to.match(/^\d+$/, 'timestamp should be an integer');
          });
          done();
        }, 2500);
      }
    });

    server.on('error', function(err) {
      assert.fail(false, false, err);
    });

    server.listen(0, "0.0.0.0", function() {
      var address = server.address();
      var report = helper.getSampleReport();
      reporter = new GraphiteReporter(report, "host1", address.address, address.port);
      reporter.on('log', function(level, msg, exc) {
        if(exc) {
          debug('%s -- %s (%s)', level, msg, exc);
        } else {
          debug('%s -- %s', level, msg);
        }
      });
      reporter.start(1000);
    });
  });
});
