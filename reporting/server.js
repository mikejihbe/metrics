var http = require('http');
/**
* trackedMetrics is an object with eventTypes as keys and metrics object as values.
* This server will print the object upon request.  The user should update the metrics
* as normal within their application.
*/
var Server = module.exports = function Server(port, trackedMetrics) {
  var self = this;
  this.trackedMetrics = trackedMetrics || {};
  this.server = http.createServer(function (req, res) {
    if (req.url.match(/^\/metrics/)) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      var metricsObj = {};
      for (namespace in self.trackedMetrics) {
        metricsObj[namespace] = {};
        for (event in self.trackedMetrics[namespace]) {
          metricsObj[namespace][event] = self.trackedMetrics[namespace][event].printObj();
        }
      }
      res.end(JSON.stringify(metricsObj));
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Try hitting /metrics instead');
    }
  }).listen(port, "127.0.0.1");
}

Server.prototype.addMetric = function(eventName, metric) {
  var namespaces = eventName.split('.')
    , event = namespaces.pop()
    , namespace = namespaces.join('.');
  if (!this.trackedMetrics[namespace]) {
    this.trackedMetrics[namespace] = {};
  }
  if(!this.trackedMetrics[namespace][event]) {
    this.trackedMetrics[namespace][event] = metric;
  }
}

