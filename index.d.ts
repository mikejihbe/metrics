// Definitions by: Pawel Badenski <https://github.com/pbadenski>

import events = require("events");

declare namespace metrics {
  type Metric = Meter | Timer | Counter | Histogram | Gauge;

  type MeterPrintObj = {
    type: "meter",

    count: number,
    m1: number,
    m5: number,
    m15: number,
    mean: number,
    unit: "seconds"
  };

  type Rates = {
    1: number;
    5: number;
    15: number;
    mean: number;
  };
  class Meter {
    type: "meter";

    mark: (n: number) => void;
    rates: () => Rates;
    fifteenMinuteRate: () => number;
    fiveMinuteRate: () => number;
    oneMinuteRate: () => number;
    meanRate: () => number;
    printObj: () => MeterPrintObj;
  }

  class TimerContext {
    stop: () => void;
  }

  class Timer {
    type: "timer";
    histogram: Histogram;
    meter: Meter;

    clear: () => void;
    update: (duration: number) => void;
    time: () => TimerContext;

    count: () => number;
    min: () => number;
    max: () => number;
    mean: () => number;
    stdDev: () => number;
    percentiles: (percentiles: number[]) => ({ [percentile: number]: number });
    values: () => number[];

    oneMinuteRate: () => number;
    fiveMinuteRate: () => number;
    fifteenMinuteRate: () => number;
    meanRate: () => number;
    tick: () => void;
    rates: () => Rates;

    printObj: () => ({
      type: "timer",
      duration: HistogramPrintObj;
      rate: MeterPrintObj;
    });
  }

  class Counter {
    type: "counter";

    clear: () => void;
    inc: (val?: number) => void;
    dec: (val?: number) => void;
    
    printObj: () => ({
      type: "counter";
      count: number;
    });
  }

  class Gauge {
    type: "gauge";

    constructor(valueFn: () => any);
    value: () => any

    printObj: () => ({
      type: "gauge";
      value: any;
    })
  }

  class CachedGauge extends Gauge {
    constructor(valueFn: () => any, expirationInMs: number);
  }

  type HistogramPrintObj = {
    type: "histogram",

    min: number,
    max: number,
    sum: number,
    variance: number | null,
    mean: number | null,
    std_dev: number | null,
    count: number,
    median: number,
    p75: number,
    p95: number,
    p99: number,
    p999: number
  };

  class Histogram {
    type: "histogram";
    sample: any;
    min: number;
    max: number;
    sum: number;
    count: number;

    clear: () => void;
    update: (value: number, timestamp?: number) => void;
    updateVariance: (value: number) => void;

    percentiles: (percentiles: number[]) => ({ [percentile: number]: number });
    variance: () => number | null;
    mean: () => number | null;
    stdDev: () => number | null;
    values: () => number[];

    printObj: () => HistogramPrintObj;
  }

  interface Metrics {
    meters: (Meter & { name: string })[];
    timers: (Timer & { name: string })[];
    counters: (Counter & { name: string })[];
    histograms: (Histogram & { name: string })[];
  }

  abstract class ScheduledReporter extends events.EventEmitter {
    constructor(registry: Report);
    start: (intervalInMs: number) => void;
    stop: () => void;
    getMetrics: () => Metrics;

    abstract report: () => void;
  }

  class ConsoleReporter extends ScheduledReporter {
    constructor(registry: Report);
    report: () => void;
  }

  class CsvReporter extends ScheduledReporter {
    constructor(registry: Report);
    report: () => void;
    write: (timestamp: number, name: string, header: string, line: string, values: any[]) => void;
    reportCounter: (counter: Counter, timestamp: number) => void;
    reportMeter: (meter: Meter, timestamp: number) => void;
    reportTimer: (timer: Timer, timestamp: number) => void;
    reportHistogram: (histogram: Histogram, timestamp: number) => void;
  }

  class GraphiteReporter extends ScheduledReporter {
    constructor(registry: Report);
    report: () => void;
    send: (name: string, value: number, timestamp: number) => void;
    reportCounter: (counter: Counter, timestamp: number) => void;
    reportMeter: (meter: Meter, timestamp: number) => void;
    reportTimer: (timer: Timer, timestamp: number) => void;
    reportHistogram: (histogram: Histogram, timestamp: number) => void;
  }

  class Report {
    addMetric: (eventName: string, metric: Metric) => void;
    getMetric: (eventName: string) => Metric;
    summary: () => { [namespace: string]: { [name: string]: Metric } };
  }

  class EWMA {
    alpha: number;
    interval: number;
    initialized: boolean;
    currentRate: number;
    uncounted: number;
    tickInterval?: number;

    constructor(alpha: number, interval: number);
    update(n: number): void;
    tick(): void;
    rate(): number;
    stop(): void;

    static createM1EWMA(): EWMA;
    static createM5EWMA(): EWMA;
    static createM15EWMA(): EWMA;
  }

  class Sample {
    values: number[];
    count: number;

    init(): void;
    update(val: number): void;
    clear(): void;
    size(): number;
    print(): void;
    getValues(): number[];
  }

  class ExponentiallyDecayingSample extends Sample {
    limit: number;
    alpha: number;
    startTime: number;
    nextScaleTime: number;

    constructor(limit: number, alpha: number);

    now(): number;
    tick(): void;
    clear(): void;
    update(val: number, timestamp?: number): void;
    weight(time: number): number;
    rescale(): void;
  }
}

export = metrics;
