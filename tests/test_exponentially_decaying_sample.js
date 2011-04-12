var ExponentiallyDecayingSample = require('../stats/exponentially_decaying_sample.js')
  , eds = new ExponentiallyDecayingSample(10000, 0.015);

eds.clear();

var time = (new Date()).getTime()
  , interval = time + 60 *60 * 1000 / 100;
for(var i = 0; i < 100; i++) {
  for(var j = 0; j < 100; j++) {
    eds.update(i, time + i * interval);
  }
}

var valueCounts = []
  , values = eds.getValues();
for(var i = 0; i < eds.size(); i++) {
  console.log(values[i]);
  /*if (valueCounts[eds.values[i].val]) {
    valueCounts[eds.values[i].val]++;
  } else {
    valueCounts[eds.values[i].val] = 0;
  }*/
}
console.log(valueCounts);



