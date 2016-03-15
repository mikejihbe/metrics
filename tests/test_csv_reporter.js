var CsvReporter = require('../').CsvReporter,
  helper = require('./helper.js'),
  fs = require('fs'),
  path = require('path'),
  os = require('os');

var test = function(callback) {
  var tryCount = 0;
  var tmpdir;
  do {
    tmpdir = os.tmpdir() + Math.random();
  } while(fs.existsSync(tmpdir) && tryCount++ < 10);

  if(fs.existsSync(tmpdir)) {
    console.log("Could not find a tmpdir to create after 10 tries.");
    if (typeof callback == 'function') {
      callback();
    }
  }
  fs.mkdirSync(tmpdir);

  var report = helper.getSampleReport();
  var reporter = new CsvReporter(report, tmpdir);
  console.log("Starting CsvReporter at 1000ms interval reporting to %s", tmpdir);
  reporter.start(1000);

  var counterFile = path.join(tmpdir, 'basicCount.csv');
  var meterFile = path.join(tmpdir, 'myapp.Meter.csv');
  var timerFile = path.join(tmpdir, 'myapp.Timer.csv');
  var files = [counterFile, meterFile, timerFile];

  setTimeout(function() {
    console.log("Reading files %s.  Each file should have 1 header and 3 recordings.", files);
    files.forEach(function(f) {
      if(fs.existsSync(f)) {
        console.log("Reading file: %s.", f);
        var content = fs.readFileSync(f);
        console.log("File contents:\n%s", content);
        fs.unlinkSync(f);
      } else {
        console.log("File %s does not exist!", f);
      }
    });
    reporter.stop();
    fs.rmdirSync(tmpdir);
    if (typeof callback == 'function') {
      callback();
    }
  }, 3500);
};

if (module.parent) {
  module.exports = test;
} else {
  test();
}