var UniformSample = require('../stats/uniform_sample');

var uniform_sample = new UniformSample(5000);
console.dir(uniform_sample);
uniform_sample.update(6);