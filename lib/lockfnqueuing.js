// Filename: lockfnqueuing.js
// Timestamp: 2015.04.11-03:20:30 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// the returned function stores mulitple callbacks and processes them one after
// another -waiting for the first to complete before calling the next, useful
// for holding off execution of function bodies that add numerous calls to the 
// stack.
// 
// lockFnQueueing = LockFnQueuing.getNew();
// lockFnQueueing(callback, function (exitFn) {
//   x = 5;
//   exitFn(null, x);
// });

var lockfnqueuing = 
      ((typeof module === 'object') ? module : {}).exports = (function (f) {

  var cache = {
    isActive : false,
    fnArr : [],
    getValArr : [],

    callLimit : function () {
      var that = this, 
          onValArr = that.fnArr, 
          getValArr = that.getValArr;

      (function nextCall (x, getVal, onVal) {
        getVal = getValArr.shift();
        onVal = onValArr.shift();
        getVal(function (a, b, c) {
          if (onVal) onVal(a, b, c);
          if (getValArr.length) {
            nextCall(getValArr.length);            
          } else {
            that.isActive = false;
          }
        });
      }(getValArr.length));
    },

    queueAdd : function (onValFn, getValFn) {
      var that = this;
      that.fnArr.push(onValFn);
      that.getValArr.push(getValFn);
      if (that.isActive === false) {
        that.isActive = true;
        that.callLimit();
      }
    }
  };

  f = function (getvalfn) {
    var o = function () {
      var l = arguments.length,
          fn = arguments[--l],
          args = [].slice.call(arguments, 0, l);

      if (typeof fn !== 'function') {
        throw new Error('last param must be function');
      }

      o.lock(fn, function (exitfn) {
        args.push(exitfn);
        getvalfn.apply(l, args);
      });
    };
    return (o.lock = f.getNew()) && o;
  };

  f.getNew = function () {
    var that = Object.create(cache);
    that.isActive = false;
    that.fnArr = [];
    that.getValArr = [];
    return function (onValFn, getValFn) { 
      that.queueAdd(onValFn, getValFn); 
    };
  };

  return f;

}());
