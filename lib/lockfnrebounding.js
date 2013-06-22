// Filename: LockFnRebounding.js
// Timestamp: 2013.06.21-23:40:31 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// first function is processed until a value is reached...
// during that time, future calls are rebounded until the function returns

var LockFnRebounding =
  ((typeof module === 'object') ? module : {}).exports = (function () {

  var cache = {
    flag : false,

    go : function (fn) {
      var that = this, 
          flag = that.flag;

      if (flag === false) {
        that.flag = true;
        fn(function () { that.flag = false; });        
      }
    }
  };

  return {
    getNew : function () {
      var that = Object.create(cache);
      that.flag = false;
      return function (fn) { that.go(fn); };
    }
  };

}());
