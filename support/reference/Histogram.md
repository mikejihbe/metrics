Histogram samples a dataset to get a sense of its distribution. These are particularly useful for breaking down the quantiles of how long things take(requests, method calls, etc). Metrics supports uniform distributions and exponentially decaying samples. Sample sizes and parameters of the distribution are all highly configurable, but the defaults may suit your needs. Exponential decay histograms favor more recent data, which is typically what you want.

Histogram instances implement: [`clear()`](#Histogram.clear), [`update()`](#Histogram.update), [`percentiles()`](#Histogram.percentiles), [`mean()`](#Histogram.mean), and [`stdDev()`](#Histogram.stdDev)

Histogram instances expose: `count`, `min`, `max`, and `sum`

Histogram implements: [`createExponentialDecayHistogram()`](#Histogram.createExponentialDecayHistogram) and [`createUniformHistogram()`](#Histogram.createUniformHistogram)

### Instantiate
`Histogram` is an exported constructor in `metrics`. It's not typically created by hand though, instead a few functions are given to create certain histograms.

```
var metrics = require('metrics'),
    hist = new metrics.Histogram.createUniformHistogram();

hist.update(1);
hist.update(3);
hist.mean(); // 2
```

### .clear
`Histogram.clear()`

Clear the histogram data.

### .update
`Histogram.update(val)`

Update the sample with the given value.

### .percentiles
`Histogram.percentiles(percentiles)`

Calculate the scores for the samples values from the given percentiles array.

### .mean
`Histogram.mean()`

Get the mean.

### .stdDev
`Histogram.stdDev()`

Get the standard deviation.

### .createExponentialDecayHistogram
`Histogram.createExponentialDecayHistogram(size, alpha)`

Create a new exponential decay histogram using the given size and alpha.

### .createUniformHistogram
`Histogram.createUniformHistogram(size)`

Create a new uniform histogram using the given size.