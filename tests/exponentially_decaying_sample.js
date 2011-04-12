var ExponentiallyDecayingSample = require('../stats/exponentially_decaying_sample.js')
  , eds = new ExponentiallyDecayingSample(10, .99);

eds.clear();

for(var i = 0; i < 10; i++) {
  eds.update(1);
}

eds.update(10, (new Date()).getTime() + 45 * 60 *1000);

console.log(eds.values);



