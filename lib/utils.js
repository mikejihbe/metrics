/*
 * Mix in the properties on an object to another object
 * utils.mixin(target, source, [source,] [source, etc.] [merge-flag]);
 * 'merge' recurses, to merge object sub-properties together instead
 * of just overwriting with the source object.
 */
exports.mixin = (function () {  
  var _mix = function (targ, src, merge) {
    for (var p in src) {
      // Don't copy stuff from the prototype
      if (src.hasOwnProperty(p)) {
        if (merge &&
            // Assumes the source property is an Object you can
            // actually recurse down into
            (typeof src[p] == 'object') &&
            (src[p] !== null) &&
            !(src[p] instanceof Array)) {
          // Create the source property if it doesn't exist
          // TODO: What if it's something weird like a String or Number?
          if (typeof targ[p] == 'undefined') {
            targ[p] = {};
          }
          _mix(targ[p], src[p], merge); // Recurse
        }
        // If it's not a merge-copy, just set and forget
        else {
          targ[p] = src[p];
        }
      }
    }
  };

  return function () {
    var args = Array.prototype.slice.apply(arguments),
        merge = false,
        targ, sources;
    if (args.length > 2) {
      if (typeof args[args.length - 1] == 'boolean') {
        merge = args.pop();
      }
    }
    targ = args.shift();
    sources = args; 
    for (var i = 0, ii = sources.length; i < ii; i++) {
      _mix(targ, sources[i], merge);
    }
    return targ;
  };
})();


//private method (to copy array of objects) - getCloneOfObject will use this internally
var cloneArray = function(oldArray) {
  var tempClone = [];
  for (var arrIndex = 0; arrIndex <= oldArray.length; arrIndex++) {
    if (typeof(oldArray[arrIndex]) == 'object') {
      tempClone.push(this.getCloneOfObject(oldArray[arrIndex]));
    } else {
      tempClone.push(oldArray[arrIndex]);
    }
  }
  return tempClone;
};

exports.cloneObject = function(oldObject) {
  var tempClone = {};

  if (typeof(oldObject) == 'object') {
    for (prop in oldObject) {
      // for array use private method getCloneOfArray
      if ((typeof(oldObject[prop]) == 'object') &&
                      (oldObject[prop]).__isArray) {
        tempClone[prop] = cloneArray(oldObject[prop]);              
      }    
      // for object make recursive call to getCloneOfObject
      else if (typeof(oldObject[prop]) == 'object') {
        tempClone[prop] = exports.cloneObject(oldObject[prop]);
      }
      // normal (non-object type) members
      else {
        tempClone[prop] = oldObject[prop];
      }
    }
    return tempClone;
  }
};
