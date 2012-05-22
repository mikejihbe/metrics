var http = require('http')
  , Report = require('./report');


/**
 * This server will print the object upon request.  The user should update the metrics
 * as normal within their application.
 */
var Server = module.exports = function Server(port, trackedMetrics) {
  var self = this;
  this.report = new Report(trackedMetrics);

  this.server = http.createServer(function (req, res) {
    if (req.url.match(/^\/metrics/)) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(self.report.summary()));
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Try hitting /metrics instead');
    }
  }).listen(port);
}

/**
 * Adds a metric to be tracked by this server
 */
Server.prototype.addMetric = function (){
  this.report.addMetric.apply(this.report, arguments);
}
