// Filename: lockfnrebounding.js
// Timestamp: 2015.04.17-15:50:49 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// first function is processed until a value is reached...
// during that time, future calls are rebounded until the function returns
// useful for button press or form submission calls

var lockfnrebounding = module.exports = (function (f) {

  var cache = {
    flag : false,

    go : function (fn) {
      var that = this, 
          flag = that.flag;

      if (flag === false) {
        that.flag = true;
        if (typeof fn === 'function') {
          fn(function () { that.flag = false; });
        } else {
          that.flag = false;
        }
      }
    }
  };

  f = function (getvalfn) {
    var rebound = f.getNew();

    return function () {
      var l = arguments.length,
          fn = arguments[--l],      
          args;

      fn = typeof fn === 'function' ? fn : false;
      args = [].slice.call(arguments, 0, fn ? l : ++l);

      rebound(function (exitfn) {
        args.push(function () {
          exitfn();
          if (typeof fn === 'function') {
            fn.apply(l, arguments);
          }
        });

        getvalfn.apply(l, args);
      });
    };
  };

  f.getNew = function () {
    var that = Object.create(cache);
    that.flag = false;
    return function (fn) { that.go(fn); };
  };

  return f;

}());
