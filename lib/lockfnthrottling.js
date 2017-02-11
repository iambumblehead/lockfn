// Filename: lockfnthrottling.js
// Timestamp: 2016.01.04-13:30:16 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)
//
//
// The constructed function is called multiple times with callbacks.
// One callback is processed and then, during a specified period of time, 
// callbacks that are given afterward are ignored.
// 
// Intended for functions bound to events triggered rapidly many times.
// 
// lockFnThrottling = LockFnThrottling.getNew({ ms : 500 });
// lockFnThrottling(function () { console.log('go!') }); // go
// lockFnThrottling(function () { console.log('go!') });

var lockfnthrottling = module.exports = (function (f) {

  var throttle = {
    ms : 500,
    timer : null,
    lastFn : null,

    throttledFn : function (fn, ...args) {
      var that = this;
      
      if (that.timer) {
        that.args = args;
        that.lastFn = fn;
      } else {
        that.timer = setTimeout(function () {
          if (that.lastFn) {
            that.isendthrottlecall && that.lastFn.apply(0, that.args);
            that.args = null;
            that.lastFn = null;
          }
          clearTimeout(that.timer);
          that.timer = null;
        }, that.ms);

        fn.apply(0, args);
      }
    }
  };

  f = function (spec, fn) {
    var throttle = f.getNew(spec);
    return function () {
      throttle.apply(0, [fn].concat([].slice.call(arguments, 0)));
    };
  };

  f.getNew = function (spec) {
    var that = Object.create(throttle);
    that.ms = spec.ms || 500;
    that.isendthrottlecall = spec.isendthrottlecall === false ? false : true;
    that.timer = null;
    that.lastFn = null;

    return function () { that.throttledFn.apply(that, arguments); };    
  };
    
  return f;

}());
