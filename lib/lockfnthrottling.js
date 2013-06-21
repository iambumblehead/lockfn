// Filename: LockFnThrottling.js
// Timestamp: 2013.06.20-20:42:44 (last modified)  
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

var LockFnThrottling =
  ((typeof module === 'object') ? module : {}).exports = (function () {

  var throttle = {
    ms : 500,
    timer : null,
    lastFn : null,

    throttledFn : function (fn) {
      var that = this;

      if (that.timer) {
        that.lastFn = fn;
      } else {
        that.timer = setTimeout(function () {
          if (that.lastFn) {
            that.lastFn();
            that.lastFn = null;
          }
          clearTimeout(that.timer);
          that.timer = null;
        }, that.ms); 
        fn();
      }
    }
  };

  return {
    getNew : function (spec) {
      var that = Object.create(throttle);
      that.ms = spec.ms || 500;
      that.timer = null;
      that.lastFn = null;
      return function (fn) { that.throttledFn(fn); };
    }
  };

}());
