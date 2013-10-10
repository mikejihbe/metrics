Meter tracks how often things happen. It exposes a 1 minute, 5 minute, and 15 minute rate using exponentially weighted moving averages(the same strategy that unix load average takes).

Meter implements: [`mark()`](#Meter.mark), [`oneMinuteRate()`](#Meter.oneMinuteRate), [`fiveMinuteRate()`](#Meter.fiveMinuteRate), [`fifteenMinuteRate()`](#Meter.fifteenMinuteRate), [`meanRate()`](#Meter.meanRate)

### Instantiate
`Meter` is an exported constructor in `metrics`.

```
var metrics = require('metrics'),
    meter = new metrics.Meter;

meter.mark();
meter.mark();
meter.mark();
meter.meanRate(); // Depends on how fast marks are called.
```

### .mark
`Meter.mark(n)`

Mark the occurence of `n` events

### .oneMinuteRate
`Meter.oneMinuteRate()`

Get the mark rate per second for a minute.

### .fiveMinuteRate
`Meter.fiveMinuteRate()`

Get the mark rate per second for 5 minutes.

### .fifteenMinuteRate
`Meter.fifteenMinuteRate()`

Get the mark rate per second for 15 minutes.

### .meanRate
`Meter.meanRate()`

Get the mean rate.