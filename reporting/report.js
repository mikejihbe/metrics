/**
* trackedMetrics is an object with eventTypes as keys and metrics object as values.
*/
var Report = module.exports = function (trackedMetrics){
  this.trackedMetrics = trackedMetrics || {};
}

Report.prototype.addMetric = function(eventName, metric) {
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

Report.prototype.summary = function (){
  var metricsObj = {};
  for (namespace in this.trackedMetrics) {
    metricsObj[namespace] = {};
    for (event in this.trackedMetrics[namespace]) {
      metricsObj[namespace][event] = this.trackedMetrics[namespace][event].printObj();
    }
  }
  return metricsObj;
}
