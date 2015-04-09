// Filename: lockfnrebounding.js
// Timestamp: 2015.04.08-18:19:51 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// first function is processed until a value is reached...
// during that time, future calls are rebounded until the function returns
// useful for button press or form submission calls

var lockfnrebounding =
  ((typeof module === 'object') ? module : {}).exports = (function (f) {

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

  f = function (getvalfn) {
    return f.getNew();
  };

  f.getNew = function () {
    var that = Object.create(cache);
    that.flag = false;
    return function (fn) { that.go(fn); };
  };

  return f;

}());
