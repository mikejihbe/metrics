var http = require('http');
/**
* trackedMetrics is an object with eventTypes as keys and metrics object as values.
* This server will print the object upon request.  The user should update the metrics
* as normal within their application.
*/
var MetricsServer = module.exports = function MetricsServer(port, trackedMetrics) {
  http.createServer(function (req, res) {
    if (req.url.match(/^metrics/i)) {
      res.writeHead(200, {'Content-Type': 'text/json'});
      var metricsObj = {};
      for (part in trackedMetrics) {
        metricsObj[part] = trackeMetrics[part].printObj();
      }
      res.end(JSON.stringify(metricsObj));
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Try hitting /metrics instead');
    }}).listen(8124, "127.0.0.1");
}

