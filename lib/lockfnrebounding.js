// Filename: lockfnrebounding.js
// Timestamp: 2017.04.19-12:23:07 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)
//
// first function is processed until a value is reached...
// during that time, future calls are rebounded until the function returns
// useful for button press or form submission calls

export default (f => {

  var cache = {
    go : (opts, fn) => {
      if (opts.flag === false) {
        opts.flag = true;
        if (typeof fn === 'function') {
          fn(() => { opts.flag = false; });
        } else {
          opts.flag = false;
        }
      }
    }
  };

  f = (getvalfn, rebound = f.getNew()) => 
    (...args) => {
      var l = args.length,
          fn = args[--l];

      fn = typeof fn === 'function' ? fn : false;
      args = [].slice.call(args, 0, fn ? l : ++l);

      rebound(exitfn => {
        args.push((...args) => {
          exitfn();
          fn && fn.apply(l, args);
        });

        getvalfn.apply(l, args);
      });
    };

  f.getNew = () => {
    var opts = { flag : false };
    return (fn) => { cache.go(opts, fn); };
  };

  return f;

})();
