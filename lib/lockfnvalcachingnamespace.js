// Filename: LockFnCachingNamespace.js
// Timestamp: 2013.06.21-17:48:49 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// funcache = PkCacheFunc.getNew();
// funcache('namespace', fn, function forGettingVal (exitFn) {
//   valIWant = "newValue";
//   exitFn(null, valIWant);
// });
//
// to clear it, simply create a new one.
// funcache = PkCacheFunc.getNew();

var LockFnCachingNamespace =
  ((typeof module === 'object') ? module : {}).exports = (function () {

  var namespaceCache = (function () {
    var cache = {
      funcArr : [],
      isActive : false,
      val : null,
      callFuncArr : function (err, blocks) {
        var that = this, funcArr = that.funcArr;
        that.isActive = false;
        while (funcArr.length) funcArr.pop()(err, blocks);
      }
    };

    return {
      getNew : function () {
        var that = Object.create(cache);
        that.funcArr = [];
        that.isActive = false,
        that.val = null;
        return that;
      }
    };
  }());

  var cache = {
    namespacesObj : {},

    getNamespaceCache : function (namespace) {
      var namespacesObj = this.namespacesObj;

      return namespacesObj[namespace] ||
        (namespacesObj[namespace] = namespaceCache.getNew());
    },

    // persists the returned value with this object
    cacheVal : function (namespace, onValFunc, getValFunc) {
      var that = this,
          namespaceCache = that.getNamespaceCache(namespace),
          val = namespaceCache.val,
          funcArr = namespaceCache.funcArr,
          isActiveFlag = namespaceCache.isActive;

      namespaceCache.funcArr.push(onValFunc);
      if (namespaceCache.isActive) return null;
      namespaceCache.isActiveFlag = !val;

      if (val) return namespaceCache.callFuncArr(null, val);

      getValFunc(function (err, newVal) {
        if (err) return namespaceCache.callFuncArr(err, newVal);
        namespaceCache.callFuncArr(err, (namespaceCache.val = newVal));
      });
    }
  };

  return {
    getNew : function () {
      var that = Object.create(cache);
      that.namespacesObj = {};
      return function (namespace, onValFunc, getValFunc) { 
        that.cacheVal(namespace, onValFunc, getValFunc); 
      };
    }
  };


}());
