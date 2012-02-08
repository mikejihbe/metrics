Metrics
=======

* A node.js port of codahale's metrics library: https://github.com/codahale/metrics

Metrics provides an instrumentation toolkit to measure the behavior of your critical systems while they're running in production.

How to Use
----------

**Import Metrics**

```javascript
metrics = require('metrics')
```

**Start a metrics Server**

```javascript
var metricsServer = new metrics.Server(config.metricsPort || 9091);
```

Servers are only one way to report your metrics.  It's actually a thin layer on top of metrics.Report, which you could use to build other reporting mechanisms.

**Create some metrics**

```javascript
  // Counters count things. They implement: inc, dec, clear
var counterForThingA = new metrics.Counter
  // Histograms collect a sample's distribution. They're highly configurable,
  // so check out the actual implementation if the defaults don't fit your needs
  // (but they probably will).  This is useful for breaking down quantiles of how long things take
  // for instance.  Exponential decay histograms favor more recent data, which
  // is typically what you want.
  // They implement: update
  , histForThingB = new metrics.createExponentialDecayHistogram()
  , histForThingC = new metrics.createUniformHistogram()
  // A meter tracks how often things happen. It exposes a 1 minute rate, a 5 minute rate, and a 15 minute rate
  // using exponentially weighted moving averages (the same strategy that unix load average takes).
  // They implement: mark
  , meterForThingD = new metrics.Meter
  // A Timer is a combination of a meter and a histogram. It samples timing data and rates of requests.  Everything you could possibly want!
  // They implement: update
  , timerForThingE = new metrics.Timer;
```

**Add the metrics to the server**

```javascript
metricsServer.addMetric('com.co.thingA', counterForThingA);
metricsServer.addMetric('com.co.thingB', counterForThingB);
metricsServer.addMetric('com.co.thingC', counterForThingC);
metricsServer.addMetric('com.co.thingD', counterForThingD);
```


Advanced Usage
--------------
Typical production deployments have multiple node processes per server.  Rather than each process exposing metrics on different ports, it makes more sense to expose the metrics from the "master" process.  Writing a thin wrapper around this api to perform the process communication is trivial, with a message passing setup, the client processes could look something like this:

```javascript
var Metric = exports = module.exports = function Metrics(messagePasser, eventType) {
  this.messagePasser = messagePasser;
  this.eventType = eventType;
}

Metric.prototype.newMetric = function(type, eventType) {
  this.messagePasser.sendMessage({
    method: 'createMetric'
    , type: type
    , eventType: eventType
  });
}
Metric.prototype.forwardMessage = function(method, args) {
  this.messagePasser.sendMessage({
    method: 'updateMetric'
    , metricMethod: method
    , metricArgs: args
    , eventType: this.eventType
  }); 
}

Metric.prototype.update = function(val) { return this.forwardMessage('update', [val]); }
Metric.prototype.mark = function(n) { return this.forwardMessage('mark', [n]); }
Metric.prototype.inc = function(n) { return this.forwardMessage('inc', [n]); }
Metric.prototype.dec = function(n) { return this.forwardMessage('dec', [n]); }
Metric.prototype.clear = function() { return this.forwardMessage('clear'); }
```

And the server side that receives the createMetric and updateMetric rpcs could look something like this:

```javascript
{
  createMetric: function(msg) {
      if (metricsServer) {
        msg.type = msg.type[0].toUpperCase() + msg.type.substring(1)
        metricsServer.addMetric(msg.eventType, new metrics[msg.type]);
      }
   }
  updateMetric: function(msg) {
    if (metricsServer) {
    var namespaces = msg.eventType.split('.')
      , event = namespaces.pop()
      , namespace = namespaces.join('.');
    var metric = metricsServer.trackedMetrics[namespace][event];
    metric[msg.metricMethod].apply(metric, msg.metricArgs);
  }
}
```

For multiple server deployments, you have more options, but the best approach will be highly application dependent. Best of luck, and always be tracking!

How to Collect
--------------

Using the metrics server you can hit the server on your configured port and you'll get a json representation of your metrics.  You should collect these periodically to generate timeseries to monitor the longterm health of your application.  The metrics.Reporting object would let you write to a log periodically or however else you'd like to expose your metrics.
