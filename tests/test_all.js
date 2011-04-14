var tests = [
  require('./test_uniform_sample')
, require('./test_exponentially_decaying_sample')
, require('./test_exponentially_weighted_moving_average')
]

for (var i in tests) {
  if (typeof tests[i] == 'function' && typeof tests[i+1] == 'function') {
    tests[i](tests[i+1]());
  } else if (typeof tests[i] == 'function') {
    tests[i]();
  }
};