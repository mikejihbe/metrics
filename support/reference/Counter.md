Counter counts things.

Counter implements: [`inc()`](#Counter.inc), [`dec()`](#Counter.dec), and [`clear()`](#Counter.clear)

Counter exposes: [`count`](#Counter.count)

### Instantiate
`Counter` is an exported constructor in `metrics`.

```
var metrics = require('metrics'),
    counter = new metrics.Counter;

counter.inc(1);
counter.inc(3);
counter.dec(2);
counter.count; // 2
counter.clear();
counter.count; // 0
```

### .inc
`Counter.inc(val)`

Increment the counter by the given `val`, wrapping the new count if over `4294967296`.

### .dec
`Counter.dec(val)`

Decrement the counter by the given `val`, the resulting count is never less than `0`.

### .clear
`Counter.clear()`

Clear the counter resetting the count to `0`.

### .count
`Counter.count`

Get the current count.
