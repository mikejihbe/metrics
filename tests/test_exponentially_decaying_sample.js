var ExponentiallyDecayingSample = require('../stats/exponentially_decaying_sample.js')
  , eds = new ExponentiallyDecayingSample(1000, 0.015);

eds.clear();

var time = (new Date()).getTime()
  , interval = 60 * 60 * 1000 / 100;
for(var i = 0; i < 100; i++) {
  for(var j = 0; j < 100; j++) {
    eds.update(i, time + i * interval);
  }
}

var valueCounts = {}
  , values = eds.getValues();

for(var i = 0; i < eds.size(); i++) {
  if (valueCounts[values[i].val]) {
    valueCounts[values[i].val]++;
  } else {
    valueCounts[values[i].val] = 1;
  }
}

console.log(valueCounts);
