var chai = require('chai')
  , assert = chai.assert
  , expect = chai.expect
  , debug = require('debug')('metrics')
  , describe = require('mocha').describe
  , fs = require('fs')
  , helper = require('./helper.js')
  , it = require('mocha').it
  , os = require('os')
  , path = require('path')
  , util = require('util')
  , CsvReporter = require('../../').CsvReporter;

describe('CsvReporter', function () {
  this.timeout(5000);
  it('should append to files on interval.', function (done) {
    var tryCount = 0;
    var tmpdir;
    do {
      var r = 'csv_reporter_test_' + Math.floor((Math.random() * 65535) + 1024);
      tmpdir = path.join(os.tmpdir(), r);
    } while(fs.existsSync(tmpdir) && tryCount++ < 10);

    if(fs.existsSync(tmpdir)) {
      debug("Could not find a tmpdir to create after 10 tries.");
    }
    debug('Making and using directory %j', tmpdir);
    fs.mkdirSync(tmpdir);

    var report = helper.getSampleReport();
    var reporter = new CsvReporter(report, tmpdir);
    debug("Starting CsvReporter at 1000ms interval reporting to %s", tmpdir);
    reporter.start(1000);

    var counterFile = path.join(tmpdir, 'basicCount.csv');
    var meterFile = path.join(tmpdir, 'myapp.Meter.csv');
    var timerFile = path.join(tmpdir, 'myapp.Timer.csv');
    var histFile = path.join(tmpdir, 'myapp.Histogram.csv');
    var gaugeFile = path.join(tmpdir, 'myapp.Gauge.csv');
    var files = [counterFile, meterFile, timerFile, histFile, gaugeFile];

    setTimeout(function() {
      debug("Reading files %s.  Each file should have 1 header and 3 recordings.", files);
      reporter.stop();
      files.forEach(function(f) {
        if(fs.existsSync(f)) {
          debug("Reading file: %s.", f);
          var content = fs.readFileSync(f);
          debug("File contents:\n%s", content);
          var data = content.toString('UTF-8').split('\n');
          expect(data.length).to.equal(5);
          // validate headers and content.
          if(f === counterFile) {
            expect(data[0]).to.equal('t,count');
            data.slice(1, 4).forEach(function (line) {
              expect(line).to.match(/.*,5/);
            });
          } else if (f === meterFile) {
            expect(data[0]).to.equal('t,count,mean_rate,m1_rate,m5_rate,m15_rate,rate_unit');
            data.slice(1, 4).forEach(function (line) {
              // don't validate mean rate since we can't determine that explicitly here.
              expect(line).to.match(/.*,10,.*,0,0,0,events\/second/);
            });
          } else if (f === histFile) {
            expect(data[0]).to.equal('t,count,max,mean,min,stddev,p50,p75,p95,p98,p99,p999');
            data.slice(1, 4).forEach(function (line) {
              expect(line).to.match(/.*,100,200,101,2,58.02298395176403,101,151.5,191.89999999999998,197.96,199.98,200/);
            });
          } else if (f === gaugeFile) {
            expect(data[0]).to.equal('t,value');
            data.slice(1, 4).forEach(function (line) {
              expect(line).to.match(/.*,0.8/);
            });
          } else {
            expect(data[0]).to.equal('t,count,max,mean,min,stddev,p50,p75,p95,p98,p99,p999,mean_rate,m1_rate,m5_rate,m15_rate,rate_unit,duration_unit');
            data.slice(1, 4).forEach(function (line) {
              expect(line).to.match(/.*,100,100,50.5,1,29.011491975882016,50.5,75.75,95.94999999999999,98.98,99.99,100,.*,0,0,0,calls\/second,millisecond/);
            });
          }
          // last line should be empty.
          expect(data[4]).to.equal('');
          fs.unlinkSync(f);
        } else {
          assert.fail(false, false, "File "  +f + " does not exist!");
        }
      });
      debug("Removing dir %j", tmpdir);
      fs.rmdirSync(tmpdir);
      done();
    }, 3500);
  });
});
