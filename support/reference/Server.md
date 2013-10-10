Server is an HTTP server that prints summaries for a `Report`.

Report implements: [`addMetric()`](#Server.addMetric)

### Instantiate
`Server` is an exported constructor in `metrics`.

```
var metrics = require('metrics'),
    server = new metrics.Server(3000);

server.addMetric('namespace.name', new metrics.Counter());
server.addMetric('counter', new metrics.Counter());
```

The server takes a port argument, and optionally a object of metrics to track, for this format please check the `Report` instantiation documentation.

The server responds with the report summary in JSON format at the endpoint `/metrics`.

For more advanced usage of reporting, you can use the `Report` constructor and create an HTTP server that responds however you'd like.

### .addMetric
`Report.addMetric(eventName, metric)`

Delegated to the servers Report instance.