// Filename: LockFn.js
// Timestamp: 2013.06.21-23:57:26 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: 

var LockFnCaching = require('./lib/lockfncaching');
var LockFnQueuing = require('./lib/lockfnqueuing');
var LockFnRebounding = require('./lib/lockfnrebounding');
var LockFnThrottling = require('./lib/lockfnthrottling');

var LockFn =
  ((typeof module === 'object') ? module : {}).exports = (function () {

  return {
    getQueuing : LockFnQueuing.getNew,
    getCaching : LockFnCaching.getNew,
    getRebounding : LockFnRebounding.getNew,
    getThrottling : LockFnThrottling.getNew
  };

}());