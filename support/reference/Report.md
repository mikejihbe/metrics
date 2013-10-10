Report tracks multiple metric instruments in a structured way with namespaces.

Report implements: [`addMetric()`](#Report.addMetric), [`getMetric()`](#Report.getMetric), [`summary()`](#Report.summary)

### Instantiate
`Report` is an exported constructor in `metrics`.

```
var metrics = require('metrics'),
    report = new metrics.Report();

report.addMetric('namespace.name', new metrics.Counter());
report.addMetric('counter', new metrics.Counter());
report.summary(); // {...}
```

Metrics can be structured by using namespaces, to put an instrument behind a namespace include the namespace before the metrics name followed by a period(e.g. `namespace.name`).

You can also include metrics already being tracked when instantiating the report. To do this, when you create an instance give it an object in the format
```
{
  namespace: { name: new metrics.Counter() },
  '': {counter: new metrics.Counter()} // Items without a namespace
}
```

### .addMetric
`Report.addMetric(eventName, metric)`

Add a new metric instrument to the given event name.

### .getMetric
`Report.getMetric(eventName)`

Retrieve the metric for the given event name.

### .summary
`Report.summary()`

Get a summary of the metric instruments being tracked in a readable format.
