var ExponentiallyDecayingSample = require('../stats/exponentially_decaying_sample.js')
  , eds = new ExponentiallyDecayingSample(10, 0.015);

eds.clear();

for(var i = 0; i < 100; i++) {
  eds.update(i);
}

for(var i = 100; i < 110; i++) {
  eds.update(10, (new Date()).getTime() + 45 * 60 *1000);
}

console.log(eds.values);



