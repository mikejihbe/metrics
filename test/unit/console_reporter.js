var expect = require('chai').expect
  , describe = require('mocha').describe
  , helper = require('./helper.js')
  , it = require('mocha').it
  , util = require('util')
  , os = require('os')
  , ConsoleReporter = require('../../').ConsoleReporter;

describe('ConsoleReporter', function () {
  it ('should report to console.', function () {
    // keep track of original log.
    var olog = console.log;

    // override console.log to capture lines logged.
    var data = [];
    console.log = function log() {
      var args = Array.prototype.slice.call(arguments);
      var msg = util.format.apply(util, args);
      data.push(msg);
    };

    // report sample report and capture stdout.
    var report = helper.getSampleReport();
    var reporter = new ConsoleReporter(report);
    reporter.report();

    // reset console.log.
    console.log = olog;

    // validate line by line.  This may be overkill but will detect when
    // unanticipated changes affect reported output.
    expect(data.length).to.equal(48);
    expect(data[0]).to.equal('Counters -----------------------------------------------------------------------');
    expect(data[1]).to.equal('basicCount');
    expect(data[2]).to.equal('             count = 5');
    expect(data[3]).to.equal('');
    expect(data[4]).to.equal('Meters -------------------------------------------------------------------------');
    expect(data[5]).to.equal('myapp.Meter');
    expect(data[6]).to.equal('             count = 10');
    // can't definitively assert the exact mean rate since time elapsed is unknown.
    expect(data[7]).to.match(/         mean rate = .* events\/second/);
    expect(data[8]).to.equal('     1-minute rate =  0.00 events/second');
    expect(data[9]).to.equal('     5-minute rate =  0.00 events/second');
    expect(data[10]).to.equal('    15-minute rate =  0.00 events/second');
    expect(data[11]).to.equal('');
    expect(data[12]).to.equal('Timers -------------------------------------------------------------------------');
    expect(data[13]).to.equal('myapp.Timer');
    expect(data[14]).to.equal('             count = 100');
    expect(data[15]).to.match(/         mean rate = .* events\/second/);
    expect(data[16]).to.equal('     1-minute rate =  0.00 events/second');
    expect(data[17]).to.equal('     5-minute rate =  0.00 events/second');
    expect(data[18]).to.equal('    15-minute rate =  0.00 events/second');
    expect(data[19]).to.equal('               min =  1.00 milliseconds');
    expect(data[20]).to.equal('               max = 100.00 milliseconds');
    expect(data[21]).to.equal('              mean = 50.50 milliseconds');
    expect(data[22]).to.equal('            stddev = 29.01 milliseconds');
    expect(data[23]).to.equal('              50% <= 50.50 milliseconds');
    expect(data[24]).to.equal('              75% <= 75.75 milliseconds');
    expect(data[25]).to.equal('              95% <= 95.95 milliseconds');
    expect(data[26]).to.equal('              98% <= 98.98 milliseconds');
    expect(data[27]).to.equal('              99% <= 99.99 milliseconds');
    expect(data[28]).to.equal('            99.9% <= 100.00 milliseconds');
    expect(data[29]).to.equal('');
    expect(data[30]).to.equal('Histograms ---------------------------------------------------------------------');
    expect(data[31]).to.equal('myapp.Histogram');
    expect(data[32]).to.equal('             count = 100');
    expect(data[33]).to.equal('               min =  2.00');
    expect(data[34]).to.equal('               max = 200.00');
    expect(data[35]).to.equal('              mean = 101.00');
    expect(data[36]).to.equal('            stddev = 58.02');
    expect(data[37]).to.equal('              50% <= 101.00');
    expect(data[38]).to.equal('              75% <= 151.50');
    expect(data[39]).to.equal('              95% <= 191.90');
    expect(data[40]).to.equal('              98% <= 197.96');
    expect(data[41]).to.equal('              99% <= 199.98');
    expect(data[42]).to.equal('            99.9% <= 200.00');
    expect(data[43]).to.equal('');
    expect(data[44]).to.equal('Gauges -------------------------------------------------------------------------');
    expect(data[45]).to.equal('myapp.Gauge');
    expect(data[46]).to.equal('             value = 0.8');
    expect(data[47]).to.equal('');
  });
});
