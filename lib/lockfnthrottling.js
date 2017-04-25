// Filename: lockfnthrottling.js
// Timestamp: 2017.04.24-22:18:02 (last modified)
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

const lockfnthrottling = module.exports = (f => {

  const throttledFn = (opts, fn, ...args) => {
    if (opts.timer) {
      opts.args = args;
      opts.lastFn = fn;
    } else {
      opts.timer = setTimeout(() => {
        if (opts.lastFn) {
          opts.isendthrottlecall && opts.lastFn.apply(0, opts.args);
          opts.args = null;
          opts.lastFn = null;
        }
        clearTimeout(opts.timer);
        opts.timer = null;
      }, opts.ms);

      fn.apply(0, args);
    }
  };

  f = (spec, fn, throttle = f.getNew(spec)) => 
    (...args) => (
      throttle(fn, ...args));
      //throttle.apply(0, [fn].concat(args)));

  f.getopts = (spec) => ({
    ms : spec.ms || 500,
    isendthrottlecall : spec.isendthrottlecall === false ? false : true,
    timer : null,
    lastFn : null
  });

  f.getNew = (spec, opts = f.getopts(spec)) => 
    (...args) => throttledFn(opts, ...args);
  
  return f;

})();
