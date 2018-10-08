/**
* trackedMetrics is an object with eventTypes as keys and metrics object as values.
*/

var _evtparse = function (eventName){
  var namespaces = eventName.split('.')
    , name = namespaces.pop()
    , namespace = namespaces.join('.');

  return {
    ns: namespace
  , name: name
  }
}

var Report = module.exports = function (trackedMetrics){
  this.trackedMetrics = trackedMetrics || {};
}

Report.prototype.addMetric = function(eventName, metric) {
  var parts = _evtparse(eventName);

  if (!this.trackedMetrics[parts.ns]) {
    this.trackedMetrics[parts.ns] = {};
  }
  if(!this.trackedMetrics[parts.ns][parts.name]) {
    this.trackedMetrics[parts.ns][parts.name] = metric;
  }
}

Report.prototype.getMetric = function (eventName){
  var parts = _evtparse(eventName);
  if (!this.trackedMetrics[parts.ns]){ return; }
  return this.trackedMetrics[parts.ns][parts.name];
}

Report.prototype.summary = function (){
  var metricsObj = {};
  for (var namespace in this.trackedMetrics) {
    metricsObj[namespace] = {};
    for (var name in this.trackedMetrics[namespace]) {
      metricsObj[namespace][name] = this.trackedMetrics[namespace][name].printObj();
    }
  }
  return metricsObj;
}
