/*
 * Returns a function that is the composition of a list of functions, 
 * each consuming the return value of the function that follows.
 */
var slice = Array.prototype.slice;
var compose = function() {
  var funcs = slice.call(arguments);
  return function() {
    var args = slice.call(arguments);
    for (var i=funcs.length-1; i >= 0; i--) {
      args = [funcs[i].apply(this, args)];
    }
    return args[0];
  };
};

compose(
  require('./test_exponentially_weighted_moving_average')
, require('./test_exponentially_decaying_sample')
, require('./test_uniform_sample')
, require('./meter')
, require('./histogram')
, require('./timer')
, require('./test_scheduled_reporter')
, require('./test_console_reporter')
, require('./test_csv_reporter')
, require('./test_graphite_reporter')
)();
