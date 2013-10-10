Timer is a combination of a `Meter` and a `Histogram`. It samples timing data and rate the data is coming in. Everything you could possibly want!

Timer implements: [`clear()`](#Timer.clear), [`update()`](#Timer.update), [`mark()`](#Timer.mark), [`count()`](#Timer.count), [`min()`](#Timer.min), [`max()`](#Timer.max), [`mean()`](#Timer.mean), [`stdDev()`](#Timer.stdDev), [`percentiles()`](#Timer.percentiles), [`oneMinuteRate()`](#Timer.oneMinuteRate), [`fiveMinuteRate()`](#Timer.fiveMinuteRate), [`fifteenMinuteRate()`](#Timer.fifteenMinuteRate), [`meanRate()`](#Timer.meanRate)

### Instantiate
`Timer` is an exported constructor in `metrics`.

```
var metrics = require('metrics'),
    timer = new metrics.Timer;

timer.update(1);
```

### .clear
`Timer.clear()`

Delegated to the timers `Histogram` instance.

### .update
`Timer.update(duration)`

Update the timers duration.

### .count
`Timer.count()`

Delegated to the timers `Histogram` instance.

### .min
`Timer.min()`

Delegated to the timers `Histogram` instance.

### .max
`Timer.max()`

Delegated to the timers `Histogram` instance.

### .mean
`Timer.mean()`

Delegated to the timers `Histogram` instance.

### .stdDev
`Timer.stdDev()`

Delegated to the timers `Histogram` instance.

### .percentiles
`Timer.percentiles(percentiles)`

Delegated to the timers `Histogram` instance.

### .oneMinuteRate
`Timer.oneMinuteRate()`

Delegated to the timers `Meter` instance.

### .fiveMinuteRate
`Timer.fiveMinuteRate()`

Delegated to the timers `Meter` instance.

### .fifteenMinuteRate
`Timer.fifteenMinuteRate()`

Delegated to the timers `Meter` instance.

### .meanRate
`Timer.meanRate()`

Delegated to the timers `Meter` instance.